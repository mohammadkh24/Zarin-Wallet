import { IsNumber, IsString } from "class-validator"

export class CreateDepositDto {
    @IsNumber()
    amount : number
}
