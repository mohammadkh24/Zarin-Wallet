import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { walletType } from './wallet.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Entity('wallet')
export class Wallet {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({type : 'numeric'})
  amount: number;
  @Column()
  invoice_number: string;

  @Column({ type: 'enum', enum: walletType })
  type: walletType;

  @Column({default : false})
  isPaid : boolean

  @Column({type : 'varchar' , nullable : true})
  authority : string

  @Column()
  userId : number
  @ManyToOne(() => UserEntity ,user => user.transactions , {onDelete : 'CASCADE'})
  user : UserEntity
}
