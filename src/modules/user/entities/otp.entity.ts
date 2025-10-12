import { Column, Entity, OneToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('otp')
export class OTPEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 6  , nullable  : true})
  code: string;

  @Column({ type: 'timestamp' })
  expires_in: Date;

  @Column({ type: 'int' })
  userId: number;

  @OneToOne(() => UserEntity, (user) => user.otp, { onDelete: 'CASCADE' })
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
