import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../types/types';
import { OTPEntity } from './otp.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  fullname: string;

  @Column({ type: 'varchar', nullable: true })
  email?: string | null;

  @Column({ type: 'varchar', nullable: true })
  mobile: string | null;

  @Column({ type: 'enum', enum: ['phone', 'email'], nullable: true })
  type: 'phone' | 'email';

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'numeric', default: 0 })
  balance: number;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  transactions: Wallet[];

  @Column({ default: false })
  emailVerify: boolean;

  @Column({ default: false })
  mobileVerify: boolean;

  @Column({ nullable: true  , type : "int"})
  otpId: number | null;
  
  @OneToOne(() => OTPEntity, (otp) => otp.user, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'otpId' })
  otp: OTPEntity | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
