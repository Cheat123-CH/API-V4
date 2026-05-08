// ================================================================>> Core Library
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
// ================================================================>> Costom Library
import { JsReportService } from '@app/services/js-report.service';
import OrderDetails from '@app/models/order/detail.model';
import Order from '@app/models/order/order.model';
import Product from '@app/models/product/product.model';
import User from '@app/models/user/user.model';

@Injectable()
export class InvoiceService {
    constructor(private jsReportService: JsReportService) { }

    // Method to generate an invoice report
    async generateReport(receiptNumber: string) {
        // Retrieving orders related to the specified receipt number
        const orders = await Order.findAll({
            where: {
                receipt_number: receiptNumber,
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name'],
                },
                {
                    model: OrderDetails,
                    attributes: ['id', 'unit_price', 'qty'],
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'name', 'image'],
                        }
                    ]
                },
            ],
            order: [['id', 'DESC']],
        });

        if (!orders || orders.length === 0) {
            throw new NotFoundException('Order not found');
        }

        let total = 0;
        orders.forEach((row) => {
            total += row.total_price;
        });

        // Structuring the data for the report
        const orderData = orders[0].toJSON();

        const dataWithServiceTitle = {
            ...orderData,
            title_of_service: 'CamCyber POS',
            // 👇 Map your details to what the template expects
            items: (orderData.details || []).map((detail: any) => ({
                name: detail.product?.name || '',
                price: detail.unit_price,
                qty: detail.qty,
            })),
            // Fields the template uses
            number: orderData.receipt_number,
            nowLocalStr: new Date(orderData.ordered_at).toLocaleDateString(),
            nowPlus20Days: new Date(new Date(orderData.ordered_at).setDate(new Date(orderData.ordered_at).getDate() + 20)).toLocaleDateString(),
        };
        // Get the report template
        const template = process.env.JS_TEMPLATE;

        try {
            // Generating the report using the JsReportService
            const result = await this.jsReportService.generateReport(template, dataWithServiceTitle);
            if (result.error) {
                throw new BadRequestException(result.error);
            }
            return result;
        } catch (error : any) {
            // Log the error or handle it in a more appropriate way
            throw new BadRequestException(error?.message || 'Failed to generate the report');
        }
    }


    async generateReportBaseOnStartDateAndEndDate(startDate: string, endDate: string) {
        // Retrieving orders within the specified date range
        const orders = await Order.findAll({
            where: {
                ordered_at: {
                    [Op.between]: [startDate, endDate],
                },
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name'],
                },
                {
                    model: OrderDetails,
                    attributes: ['id', 'unit_price', 'qty'],
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'name', 'image'],
                        }
                    ]
                },
            ],
            order: [['id', 'DESC']],
        });

        // Handling case when no orders are found
        if (!orders || orders.length === 0) {
            return { message: 'No orders found within the specified date range' };
        }

        // Calculating the total price of all orders
        let total = 0;
        orders.forEach((row) => {
            total += row.total_price;
        });

        // Structuring the data for the report
        const data = orders.map(order => order.toJSON()); // Convert Sequelize instances to plain objects

        const dataWithServiceTitle = data.map(order => ({
            ...order,
            title_of_service: 'Car Service',
        }));

        // Get the report template
        const template = process.env.JS_TEMPLATE;

        try {
            // Generating the report using the JsReportService
            const result = await this.jsReportService.generateReport(template, dataWithServiceTitle);
            if (result.error) {
                throw new BadRequestException(result.error);
            }

            // Returning the generated report
            return result;
        } catch (error : any) {
            // Log the error or handle it in a more appropriate way
            throw new BadRequestException(error?.message || 'Failed to generate the report');
        }
    }

}
