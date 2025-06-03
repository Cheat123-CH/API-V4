// ===========================================================================>> Core Library
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

// ===========================================================================>> Third party Library
import { Op, Sequelize } from "sequelize";

// ===========================================================================>> Custom Library
import { FileService }  from "@app/services/file.service";
import Product          from "@app/models/product/product.model";
import ProductType      from "@app/models/product/type.model";
import { CreateProductTypeDto, UpdateProductTypeDto } from "./dto";

@Injectable()
export class ProductTypeService {
  constructor(private readonly _fileService: FileService) {}

  // ==========================================>> get data
  async getData(){

    try {

      const data = await ProductType.findAll({
        attributes: [  "id", "name",  "image", "created_at", [Sequelize.fn("COUNT", Sequelize.col("products.id")), "n_of_products"]],
        include: [
          {
            model: Product,
            attributes: [], // We don't need any product attributes, just the count
          },
        ],
        group: ["ProductType.id"], // Group by the ProductType id
        order: [["name", "DESC"]], // Order by name
      });

      return {
        data: data
      }; 

    } catch (error) {

      throw new BadRequestException('admin/product/type/getData', error);
    }

    
  }

  // ==========================================>> create
  async create(
    body: CreateProductTypeDto
  ): Promise<any> {

    // ===>> Upload Image
    const result = await this._fileService.uploadBase64Image(
      "productType", // Folder Name
      body.image // the image as base64 from client
    );

    // ===>> Save to DB
    const data = await ProductType.create({
      name  : body.name,
      image : result.data.uri,
    });

    // ===>> Prepare format to Client
    const dataFormat = {
      data    : data,
      message : "Product type has been created.",
    } as { data: ProductType; message: string };

    // ===>> Return to Client
    return dataFormat;

  }

  // ==========================================>> update
  async update(
    body  : UpdateProductTypeDto,
    id    : number
  ): Promise<any> {

    // Check if submitted data is valide. 
    const data = await ProductType.findByPk(id, {
      attributes: ["id", "name", "image", "updated_at"],
    }); 

    if(!data){
      throw new NotFoundException("Product Type is not found.");
    }

    // Check if Image is submitted.
    if(this._isBase64(body.image)){
      
      // Upload the image to file service. 
      const result = await this._fileService.uploadBase64Image(
        "productType", // Folder Name
        body.image // the image as base64 from client
      );

      // Update the body.image from base64 to uri. 
      body.image = result.data.uri; 

    }

    // Save the update data to DB. 
    await ProductType.update(body, {
      where: { id: id },
    });

    
    // Prepare response format. 
    const dataFormat = {
      data    : data,
      message : "Product type has been updated.",
    } as { data: ProductType; message: string };

    // return back to client
    return dataFormat;

  }

  // ==========================================>> delete
  async delete(id: number): Promise<any> {

    // Check if submitted data is valide. 
    const data = await ProductType.findByPk(id, {
      attributes: ["id", "name", "image", "updated_at"],
    }); 

    if(!data){
      throw new NotFoundException("Product Type is not found.");
    }

    // Delete from DB. 
    await ProductType.destroy({
      where: { id: id },
    });

    // Response back to client
    return { message: "Data has been deleted successfully." };

  }


  private _isBase64(input: string): boolean {
    if (!input || typeof input !== 'string') return false;

    // If input is a data URI (e.g., data:image/png;base64,...), extract the Base64 part
    const base64Part = input.includes('base64,') ? input.split('base64,')[1] : input;

    // Remove any surrounding whitespace
    const trimmed = base64Part.trim();

    // Must be length divisible by 4
    if (trimmed.length % 4 !== 0) return false;

    // Validate using regex
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

    return base64Regex.test(trimmed);
  }

}
