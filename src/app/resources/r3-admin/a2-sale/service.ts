// ===========================================================================>> Core Library
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// ===========================================================================>> Third party Library
import { Op, Order as SeqOrder, col, Sequelize } from 'sequelize';
// ===========================================================================>> Costom Library

import User         from '@app/models/user/user.model';
import Order        from 'src/app/models/order/order.model';
import OrderDetails from '@app/models/order/detail.model';
import Product      from '@app/models/product/product.model';
import ProductType  from '@app/models/product/type.model';

import { List } from './interface';

@Injectable()
export class SaleService {

    public shortItems = [
        {
            key         : 'ordered_at', 
            display     : 'ថ្ងៃបញ្ជាទិញ'
        },
        {
            key         : 'total_price', 
            display     : 'តម្លៃលក់'
        }
    ];

    async getSetupData() {
        const cashiers = await User.findAll({
            attributes: ['id', 'name']
        }); 

        
        return { 
            cashiers    : cashiers,
            shortItems  : this.shortItems
        };
    }

    async getData(
        params?: {
            //=========================>> Pagination
            page?           : number,
            limit?           : number, 

            //=========================>> Search
            key?            : string,

            //=========================>> Sort
            sort?           : string,
            order?           : string,

            //=========================>> Filter
            cashier?          : number;
            platform?         : string;

            fromDate?             : string;
            toDate?               : string;
        }
    ) {
        try {
            // return params; 

            // ===>> Calculate Pagination Page
            const offset = (params.page - 1) * params.limit;

            // ===>> Build the dynamic `where` clause
            const where: any = {};

            // ===>> Search by Key
            if(params?.key  && params.key != ''){
                where.receipt_number = { [Op.like]: `%${params?.key}%` };
            }

            // ===>> Filters
            // By Cashier
            if (params?.cashier) { 
                where.cashier_id = params.cashier; 
            }

            // By Platform
            if (params?.platform !== null && params.platform !== undefined && params.platform !== "") { 
                where.platform = params.platform; 
            }

            // By Date Range
            if(params?.fromDate && params?.toDate ){

                where.created_at = { [Op.gte]: params?.fromDate }; // gte: greater than
                where.created_at = { 
                    ... where.created_at,
                    [Op.lte]: params?.toDate // lte: lower than
                };
            }

            // ===>> Build Sort & Order
            const order     = [];
            // check if the params?.order is in the shortItems. 
            if(params?.order){
                this.shortItems.forEach(e =>{
                    if(e.key == params?.sort){
                        order.push([ col(params?.sort), params?.order ]); 
                    }
                    
                }); 
            }

            // Default order
            order.push([ col('id'), 'DESC' ]); 
            
            
            

            // ===>> Query Data from Database
            const { rows, count }  = await Order.findAndCountAll({
                attributes: ['id', 'receipt_number', 'total_price', 'platform', 'ordered_at'],
                // include: [
                //     {
                //         model: OrderDetails,
                //         attributes: ['id', 'unit_price', 'qty'],
                //         include: [
                //             {
                //                 model: Product,
                //                 attributes: ['id', 'name', 'code', 'image'],
                //                 include: [
                //                     {   model: ProductType, 
                //                         attributes: ['name'] 
                //                     }
                //                 ],
                //             },
                //         ],
                //     },
                //     { 
                //         model: User, 
                //         attributes: ['id', 'avatar', 'name'] 
                //     },
                // ],

                where       : where,
                distinct    : true,
                order       : order,
                limit       : params.limit,
                offset      : offset,
            });

            // Calculate total pages
            const totalPage = Math.ceil(count / params.limit);

            return  {
                params: params,
                // status  : 'success',
                data    : rows,

                pagination: {
                    page        : params.page,
                    limit       : params.limit,
                    totalPage   : totalPage,
                    total       : count,
                }, 
                
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
