import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../types/types';

import type { UserToken } from '../types/types';
import { OTPEntity } from './otp.entity';

@Entity('user')
export class UserEntity {
  @PrimaryColumn()
  id: number;

  @Column({nullable : true})
  fullname: string;

  @Column({ type: 'varchar', nullable: true })
  mobile: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'numeric', default: 0 })
  balance: number;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  transactions: Wallet[];

  @Column('json', { nullable: true })
  token?: UserToken;

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
