import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactinfoEntity } from './contactinfo.entity';
import { Repository } from 'typeorm';
import { EmployeeEntity } from '../employees/employee.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ContactinfoService {
  constructor(
    @InjectRepository(ContactinfoEntity)
    private contactInfo: Repository<ContactinfoEntity>,
    @InjectRepository(EmployeeEntity)
    private employeeEntity: Repository<EmployeeEntity>,
    private jwtService: JwtService,
  ) {}
  async createContact(profile: string, phone: number, data): Promise<any> {
    const currentUser = await this.employeeEntity?.findOne(data);
    const newContact = await this.contactInfo.create({
      profile: profile,
      phone: phone,
      employee: currentUser,
    });
    try {
      console.log(currentUser);
      if (currentUser) {
        await this.contactInfo.save(newContact);
      }
      return newContact;
    } catch (error) {
      return {
        message: error.sqlMessage,
      };
    }
  }

  async findContacts(): Promise<any> {
    return this.contactInfo.find();
  }
  async updateOne(id: number, data, user) {
    const currentUser = await this.employeeEntity.findOne(user);
    const contacts = await this.contactInfo.findOne({
      employeeId: currentUser.id
    });
    // console.log(contacts)
    try {
     if (contacts.id == id){
       console.log(currentUser.id === contacts.employeeId)
       const updated = await this.contactInfo.update(id, data)
       console.log(updated)
       return  updated
     }else {
       return  {
         message: 'can only update your contact'
       }
     }

    } catch (error) {
      throw new BadRequestException('contact already exist');
    }
  }
  async deleteOne(id: number): Promise<any> {
    return this.contactInfo.delete(id);
  }
}
