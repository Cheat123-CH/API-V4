// ===========================================================================>> Core Library
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// ===========================================================================>> Third party Library
import { Op, Sequelize } from 'sequelize';
// ===========================================================================>> Costom Library
import OrderDetails from '@app/models/order/detail.model';
import Product from '@app/models/product/product.model';
import ProductType from '@app/models/product/type.model';
import User from '@app/models/user/user.model';
import Order from 'src/app/models/order/order.model';
import { List } from './interface';

@Injectable()
export class SaleService {


    async getUser() {
        const data = await User.findAll({
            attributes: ['id', 'name']
        })

        return { data: data };
    }

    async getData(
        params?: {
            //=========================>> Pagination
            page?           : number,
            limit?           : number, 

            //=========================>> Search
            key?            : string,

            //=========================>> Sort
            sort_by?         : string,
            order?           : string,

            //=========================>> Filter
            cashier?          : number;
            platform?         : string;
        }
    ) {
        try {
            
            // return params;

            const offset = (params.page - 1) * params.limit;

            // Helper function to convert date to Cambodia's timezone (UTC+7)
            // const toCambodiaDate = (dateString: string, isEndOfDay = false): Date => {
            //     const date = new Date(dateString);
            //     const utcOffset = 7 * 60; // UTC+7 offset in minutes
            //     const localDate = new Date(date.getTime() + utcOffset * 60 * 1000);

            //     if (isEndOfDay) {
            //         localDate.setHours(23, 59, 59, 999); // End of day
            //     } else {
            //         localDate.setHours(0, 0, 0, 0); // Start of day
            //     }
            //     return localDate;
            // };

            // Calculate start and end dates for the filter
            // const start = startDate ? toCambodiaDate(startDate) : null;
            // const end = endDate ? toCambodiaDate(endDate, true) : null;

            // ===>> Build the dynamic `where` clause with key
            const where: any = {};

            // ===>> Search by Key
            if(params?.key  && params.key != ''){
                where["receipt_number"] = { [Op.like]: `%${params?.key}%` };
            }
            // ===>> Filters
            // By Cashier
            if (params?.cashier) { 
                where["cashier_id"] = params.cashier; 
            }

            // By Platform
            if (params?.platform !== null && params.platform !== undefined && params.platform !== "") { 
                where["platform"] = params.cashier; 
            }

            // ===>> Query Data from Database
            const { rows, count }  = await Order.findAndCountAll({
                attributes: ['id', 'receipt_number', 'total_price', 'platform', 'ordered_at'],
                include: [
                    {
                        model: OrderDetails,
                        attributes: ['id', 'unit_price', 'qty'],
                        include: [
                            {
                                model: Product,
                                attributes: ['id', 'name', 'code', 'image'],
                                include: [{ model: ProductType, attributes: ['name'] }],
                            },
                        ],
                    },
                    { model: User, attributes: ['id', 'avatar', 'name'] },
                ],
                where   : where,
                order   : [['ordered_at', 'DESC']],
                limit   : params.limit,
                offset  : offset,
            });

            // Calculate total pages
            const totalPage = Math.ceil(count / params.limit);

            return  {
                status  : 'success',
                data    : rows,

                pagination: {
                    page        : params.page,
                    limit       : params.limit,
                    totalPage   : totalPage,
                    total       : count,
                }
            };

        } catch (error) {

            console.error('admin/sale/getData', error);
            throw new BadRequestException(error.message);

        }
    }


    async delete(id: number): Promise<{ message: string }> {
        try {
            const rowsAffected = await Order.destroy({
                where: {
                    id: id
                }
            });

            if (rowsAffected === 0) {
                throw new NotFoundException('Sale record not found.');
            }

            return { message: 'This order has been deleted successfully.' };
        } catch (error) {
            throw new BadRequestException(error.message ?? 'Something went wrong!. Please try again later.', 'Error Delete');
        }
    }
}
