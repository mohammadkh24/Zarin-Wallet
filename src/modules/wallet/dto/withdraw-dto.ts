import { IsNumber } from "class-validator";

export class CreateWithdreawDto {
    @IsNumber()
    amount : number
}
