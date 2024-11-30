// ===========================================================================>> Core Library
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// ============================================================================>> Third Party Library
import { literal, Op } from 'sequelize';

// ===========================================================================>> Costom Library
import OrderDetails from '@models/order/detail.model';
import Order from '@models/order/order.model';
import User from '@models/user/users.model';
import { FileService } from 'src/app/services/file.service';
import Product from 'src/models/product/product.model';
import ProductsType from 'src/models/product/type.model';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { List } from './product.stype';

@Injectable()
export class ProductService {

    constructor(private readonly fileService: FileService) { };

    // Method to retrieve the setup data for product types
    async setup() {
        // Fetch product types
        const productTypes = await ProductsType.findAll({
            attributes: ['id', 'name'],
        });

        // Fetch users
        const users = await User.findAll({
            attributes: ['id', 'name'],
        });
        return {
            data: {
                productTypes,
                users,
            },
        };
    }

    async listing(
        page_size: number = 10,
        page: number = 1,
        key?: string,
        type_id?: number,
        creator_id?: number,
        startDate?: string,
        endDate?: string
    ) {
        try {
            const toCambodiaDate = (dateString: string, isEndOfDay = false): Date => {
                const date = new Date(dateString);
                const utcOffset = 7 * 60; // UTC+7 offset in minutes
                const localDate = new Date(date.getTime() + utcOffset * 60 * 1000);

                if (isEndOfDay) {
                    localDate.setHours(23, 59, 59, 999); // End of day
                } else {
                    localDate.setHours(0, 0, 0, 0); // Start of day
                }
                return localDate;
            };

            // Calculate start and end dates for the filter
            const start = startDate ? toCambodiaDate(startDate) : null;
            const end = endDate ? toCambodiaDate(endDate, true) : null;
            const offset = (page - 1) * page_size;

            // Define the WHERE condition based on provided parameters
            const where: any = {
                [Op.and]: [
                    key
                        ? {
                            [Op.or]: [
                                { code: { [Op.iLike]: `%${key}%` } },
                                { name: { [Op.iLike]: `%${key}%` } },
                            ],
                        }
                        : {},
                    type_id ? { type_id: Number(type_id) } : {},
                    creator_id ? { creator_id: Number(creator_id) } : {},
                    start && end ? { created_at: { [Op.between]: [start, end] } } : {},
                ],
            };

            // Retrieve products with associated product types and users
            const data = await Product.findAll({
                attributes: [
                    'id',
                    'code',
                    'name',
                    'image',
                    'unit_price',
                    'created_at',
                    [
                        literal(`(
                  SELECT SUM(qty) 
                  FROM order_details AS od 
                  WHERE od.product_id = "Product"."id"
                )`),
                        'total_sale',
                    ],
                ],
                where,
                include: [
                    {
                        model: ProductsType,
                        attributes: ['id', 'name'],
                    },
                    {
                        model: OrderDetails,
                        as: 'pod',
                        attributes: [],
                    },
                    {
                        model: User,
                        attributes: ['id', 'name', 'avatar'],
                    },
                ],
                order: [['id', 'DESC']],
                limit: page_size,
                offset,
            });

            // Calculate the total count for pagination
            const totalCount = await Product.count({ where });

            // Calculate the total pages based on the total count
            const totalPages = Math.ceil(totalCount / page_size);

            // Format the response data
            const dataFormat: List = {
                status: 'success',
                data,
                pagination: {
                    currentPage: page,
                    perPage: page_size,
                    totalPages,
                    totalItems: totalCount,
                },
            };

            return dataFormat;
        } catch (error) {
            console.error('Error in listing method:', error); // Log the error for debugging
            throw new Error('Internal server error');
        }
    }

    async view(product_id: number) {
        const where: any = {
            product_id: product_id,
        };

        const data = await Order.findAll({
            attributes: ['id', 'receipt_number', 'total_price', 'platform', 'ordered_at'],
            include: [
                {
                    model: OrderDetails,
                    where: where,
                    attributes: ['id', 'unit_price', 'qty'],
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'name', 'code', 'image'],
                            include: [{ model: ProductsType, attributes: ['name'] }],
                        },
                    ],
                },
                { model: User, attributes: ['id', 'avatar', 'name'] },
            ],
            order: [['ordered_at', 'DESC']],
            limit: 10,
        });
        return { data: data };
    }

    // Method to create a new product
    async create(body: CreateProductDto, creator_id: number): Promise<{ data: Product, message: string }> {
        // Check if the product code already exists
        const checkExistCode = await Product.findOne({
            where: { code: body.code }
        });
        if (checkExistCode) {
            throw new BadRequestException('This code already exists in the system.');
        }

        // Check if the product name already exists
        const checkExistName = await Product.findOne({
            where: { name: body.name }
        });
        if (checkExistName) {
            throw new BadRequestException('This name already exists in the system.');
        }

        const result = await this.fileService.uploadBase64Image('product', body.image);
        if (result.error) {
            throw new BadRequestException(result.error);
        }
        // Replace base64 string by file URI from FileService
        body.image = result.file.uri;

        // Create the new product
        const product = await Product.create({
            ...body,
            creator_id,
        });
        const data = await Product.findByPk(product.id, {
            attributes: ['id', 'code', 'name', 'image', 'unit_price', 'created_at',
                [literal(`(SELECT COUNT(*) FROM order_details AS od WHERE od.product_id = "Product"."id" )`),
                    'total_sale',]],
            include: [
                {
                    model: ProductsType,
                    attributes: ['id', 'name']
                },
                {
                    model: OrderDetails,
                    as: 'pod',
                    attributes: [],
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'avatar'],
                }
            ],
        });
        return {
            data: data,
            message: 'Product has been created.'
        };
    }

    // Method to update an existing product
    async update(body: UpdateProductDto, id: number): Promise<{ data: Product, message: string }> {
        // Check if the product with the given ID exists
        const checkExist = await Product.findByPk(id);
        if (!checkExist) {
            throw new BadRequestException('No data found for the provided ID.');
        }

        // Check if the updated code already exists for another product
        const checkExistCode = await Product.findOne({
            where: {
                id: { [Op.not]: id },
                code: body.code
            }
        });
        if (checkExistCode) {
            throw new BadRequestException('This code already exists in the system.');
        }

        // Check if the updated name already exists for another product
        const checkExistName = await Product.findOne({
            where: {
                id: { [Op.not]: id },
                name: body.name
            }
        });
        if (checkExistName) {
            throw new BadRequestException('This name already exists in the system.');
        }

        if (body.image) {
            const result = await this.fileService.uploadBase64Image('product', body.image);
            if (result.error) {
                throw new BadRequestException(result.error);
            }
            // Replace base64 string by file URI from FileService
            body.image = result.file.uri;
        } else {
            body.image = undefined;
        }

        // Update the product
        await Product.update(body, {
            where: { id: id }
        });
        const data = await Product.findByPk(id, {
            attributes: ['id', 'code', 'name', 'image', 'unit_price', 'created_at',
                [literal(`(SELECT COUNT(*) FROM order_details AS od WHERE od.product_id = "Product"."id" )`),
                    'total_sale',]],
            include: [
                {
                    model: ProductsType,
                    attributes: ['id', 'name']
                },
                {
                    model: OrderDetails,
                    as: 'pod',
                    attributes: [],
                },
                {
                    model: User,
                    attributes: ['id', 'name', 'avatar'],
                }
            ],
        });
        // Retrieve and return the updated product
        return {
            data: data,
            message: 'Product has been updated.'
        };
    }

    // Method to delete a product by ID
    async delete(id: number): Promise<{ message: string }> {
        try {
            // Attempt to delete the product
            const rowsAffected = await Product.destroy({
                where: {
                    id: id
                }
            });

            // Check if the product was found and deleted
            if (rowsAffected === 0) {
                throw new NotFoundException('Product not found.');
            }

            return { message: 'This product has been deleted successfully.' };
        } catch (error) {
            // Handle any errors during the delete operation
            throw new BadRequestException(error.message ?? 'Something went wrong! Please try again later.', 'Error Delete');
        }
    }

}
