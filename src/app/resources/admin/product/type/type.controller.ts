// ===========================================================================>> Core Library
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";

// ===========================================================================>> Custom Library
import ProductsType from "src/models/product/type.model";
import { CreateProductTypeDto, UpdateProductTypeDto } from "./type.dto";
import { ProductsTypeService } from "./type.service";

@Controller()
export class ProductsTypeController {
  constructor(private _service: ProductsTypeService) {}

  @Get("data")
  async getData(): Promise<{
    data: {
      id: number;
      name: string;
      created_at: Date;
      n_of_products: number;
    }[];
  }> {
    return await this._service.getData();
  }

  @Post()
  async create(
    @Body() body: CreateProductTypeDto
  ): Promise<{ data: ProductsType; message: string }> {
    return await this._service.create(body);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateProductTypeDto
  ): Promise<any> {
    return this._service.update(body, id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async delete(@Param("id") id: number): Promise<{ message: string }> {
    return await this._service.delete(id);
  }
}
