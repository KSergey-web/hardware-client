import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL } from '../app.module';
import { AnswerArrayStudentsPopulate1 } from '../interfaces/answer-array-students-populate1.interface';
import { DefaultArrayAnswer } from '../interfaces/default-array-answer.interface';
import { IStudent } from '../interfaces/student.interface';
import { IUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(
    @Inject(API_URL) private apiUrl: string,
    private http: HttpClient,
  ) { }

  isUserAStudent(user: IUser): Observable<boolean>{
    return this.http
      .get<DefaultArrayAnswer>(`${this.apiUrl}/api/students?filters[user][id][$eq]=${user.id}`).pipe(map(res => {
        return (res.data.length > 0) ? true : false;
      }))
  }

  getInfoAboutStudentByUserId(userId: number): Observable<null | IStudent>{
    const filter0 = `filters[user][id][$eq][0]=${userId}`;
    return this.http.get<AnswerArrayStudentsPopulate1>(
      `${this.apiUrl}/api/students?populate=%2A&` + filter0).pipe(
        map((res) => {
          if (res.data.length === 0) return null;
          return this.getStudentsFromResponse(res)[0];
        })
      );
  }

  getStudentsFromResponse(res: AnswerArrayStudentsPopulate1): IStudent[] {
    const students: IStudent[] = [];
    res.data.forEach((item) => {
      const student: any = {
        id: item.attributes.user.data.id,
        ...item.attributes.user.data.attributes
      };
      student.group = {
        id: item.attributes.group.data.id,
        ...item.attributes.group.data.attributes,
      };
      students.push(student as IStudent);
    });
    return students;
  }
}
