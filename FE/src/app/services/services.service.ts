import { Injectable } from '@angular/core';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root',
})
export class ServicesService extends AppService {
  //   _   _ ___  ___ _ __ 
  //  | | | / __|/ _ \ '__|
  //  | |_| \__ \  __/ |   
  //   \__,_|___/\___|_|  
  
  checkToken() {
    return "/users/checkToken";
  }
                        
  login() {
    return "/users/login";
  }

  createUser() {
    return "/users/create";
  }

  getUser(id: string) {
    return `/users/${id}`;
  }

  deleteUser(id: string) {
    return `/users/${id}`;
  }

  updateUser(id: string) {
    return `/users/${id}`;
  }

  updateUserPassword() {
    return "/users/updatePassword";
  }

  //   _                 _                   _                              
  //  | |               | |                 | |                             
  //  | |_ ___ ______ __| | ___     ___ __ _| |_ ___  __ _  ___  _ __ _   _ 
  //  | __/ _ \______/ _` |/ _ \   / __/ _` | __/ _ \/ _` |/ _ \| '__| | | |
  //  | || (_) |    | (_| | (_) | | (_| (_| | ||  __/ (_| | (_) | |  | |_| |
  //   \__\___/      \__,_|\___/   \___\__,_|\__\___|\__, |\___/|_|   \__, |
  //                                                  __/ |            __/ |
  //                                                 |___/            |___/ 
  
  getAllTodoCategory() {
    return "/todoCategory/getAll";
  }

  getOneTodoCategory(id: string) {
    return `/todoCategory/${id}`;
  }

  createTodoCategory() {
    return "/todoCategory/create";
  }

  deleteTodoCategory(id: string) {
    return `/todoCategory/${id}`;
  }

  updateTodoCategory(id: string) {
    return `/todoCategory/${id}`;
  }

  //   _                 _         _            _    
  //  | |               | |       | |          | |   
  //  | |_ ___ ______ __| | ___   | |_ __ _ ___| | __
  //  | __/ _ \______/ _` |/ _ \  | __/ _` / __| |/ /
  //  | || (_) |    | (_| | (_) | | || (_| \__ \   < 
  //   \__\___/      \__,_|\___/   \__\__,_|___/_|\_\
                                                  
  getAllTodoTask() {
    return "/todoTask/getAll";
  }

  getAllTodoTaskByCategory(id: string) {
    return `/todoTask/getAll/${id}`;
  }

  getOneTodoTask(id: string) {
    return `/todoTask/${id}`;
  }

  createTodoTask() {
    return "/todoTask/create";
  }

  deleteTodoTask(id: string) {
    return `/todoTask/${id}`;
  }

  updateTodoTask(id: string) {
    return `/todoTask/${id}`;
  }
}
