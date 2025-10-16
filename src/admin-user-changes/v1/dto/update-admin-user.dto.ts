import { IsInt, IsOptional, IsString } from "class-validator";




export class UpdateAdminUser{


@IsInt()
id : number;


@IsString()
@IsOptional()
firstname : string;

@IsString()
@IsOptional()
lastname : string;

@IsString()
@IsOptional()
address :string;

@IsString()
@IsOptional()
country : string;

@IsString()
@IsOptional()
phone : string;

@IsString()
@IsOptional()
postalcode : string;

@IsString()
@IsOptional()
state : string;


@IsString()
@IsOptional()
Bio : string;


}

