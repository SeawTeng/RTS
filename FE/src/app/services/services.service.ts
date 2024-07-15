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
    return '/users/checkToken';
  }

  login() {
    return '/users/login';
  }

  createUser() {
    return '/users/create';
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
    return '/users/updatePassword';
  }

  resetPassword() {
    return `/users/resetPassword`;
  }

  validateResetPassword(id: string) {
    return `/users/validateResetPassword/${id}`;
  }

  updateResetPassword() {
    return `/users/updateResetPassword`;
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
    return '/todoCategory/getAll';
  }

  getOneTodoCategory(id: string) {
    return `/todoCategory/${id}`;
  }

  createTodoCategory() {
    return '/todoCategory/create';
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
    return '/todoTask/getAll';
  }

  getAllTodoTaskByCategory(id: string) {
    return `/todoTask/getAll/${id}`;
  }

  getOneTodoTask(id: string) {
    return `/todoTask/${id}`;
  }

  createTodoTask() {
    return '/todoTask/create';
  }

  deleteTodoTask(id: string) {
    return `/todoTask/${id}`;
  }

  updateTodoTask(id: string) {
    return `/todoTask/${id}`;
  }

  downloadActiveTodoTask() {
    return '/todoTask/downloadActiveTask';
  }

  //               _                             _   _
  //              (_)                           | | (_)
  //    __ _ _   _ _ ____   __ _ _   _  ___  ___| |_ _  ___  _ __
  //   / _` | | | | |_  /  / _` | | | |/ _ \/ __| __| |/ _ \| '_ \
  //  | (_| | |_| | |/ /  | (_| | |_| |  __/\__ \ |_| | (_) | | | |
  //   \__, |\__,_|_/___|  \__, |\__,_|\___||___/\__|_|\___/|_| |_|
  //      | |                 | |
  //      |_|                 |_|

  getAllQuizQuestion() {
    return '/quizQuestion/getAll';
  }

  getOneQuizQuestion(id: string) {
    return `/quizQuestion/${id}`;
  }

  getActiveQuizQuestion() {
    return '/quizQuestion/active';
  }

  createQuizQuestion() {
    return '/quizQuestion/create';
  }

  deleteQuizQuestion(id: string) {
    return `/quizQuestion/${id}`;
  }

  updateQuizQuestion(id: string) {
    return `/quizQuestion/${id}`;
  }

  setDefaultQuizQuestion(id: string) {
    return `/quizQuestion/default/${id}`;
  }

  //               _
  //              (_)
  //    __ _ _   _ _ ____   __ _ _ __  _____      _____ _ __
  //   / _` | | | | |_  /  / _` | '_ \/ __\ \ /\ / / _ \ '__|
  //  | (_| | |_| | |/ /  | (_| | | | \__ \\ V  V /  __/ |
  //   \__, |\__,_|_/___|  \__,_|_| |_|___/ \_/\_/ \___|_|
  //      | |
  //      |_|

  getAllQuizAnswer() {
    return '/quizAnswer/getAll';
  }

  getOneQuizAnswer(id: string) {
    return `/quizAnswer/${id}`;
  }

  createQuizAnswer() {
    return '/quizAnswer/create';
  }

  deleteQuizAnswer(id: string) {
    return `/quizAnswer/${id}`;
  }

  updateQuizAnswer(id: string) {
    return `/quizAnswer/${id}`;
  }

  //                                   _                   _   _
  //                                  | |                 | | (_)
  //   _ __   ___  _ __ ___   ___   __| | ___  _ __ ___   | |_ _ _ __ ___   ___ _ __
  //  | '_ \ / _ \| '_ ` _ \ / _ \ / _` |/ _ \| '__/ _ \  | __| | '_ ` _ \ / _ \ '__|
  //  | |_) | (_) | | | | | | (_) | (_| | (_) | | | (_) | | |_| | | | | | |  __/ |
  //  | .__/ \___/|_| |_| |_|\___/ \__,_|\___/|_|  \___/   \__|_|_| |_| |_|\___|_|
  //  | |
  //  |_|
  createPomoSess() {
    return `/pomodoroTimer/create`;
  }

  getAllPomoSess() {
    return `/pomodoroTimer/getAll`;
  }

  //       _ _                        _
  //      | (_)                      (_)
  //    __| |_ ___  ___ _   _ ___ ___ _  ___  _ __
  //   / _` | / __|/ __| | | / __/ __| |/ _ \| '_ \
  //  | (_| | \__ \ (__| |_| \__ \__ \ | (_) | | | |
  //   \__,_|_|___/\___|\__,_|___/___/_|\___/|_| |_|

  getAllDiscussion() {
    return '/discussion/getAll';
  }

  getOneDiscussion(id: string) {
    return `/discussion/${id}`;
  }

  createDiscussion() {
    return '/discussion/create';
  }

  deleteDiscussion(id: string) {
    return `/discussion/${id}`;
  }

  updateDiscussion(id: string) {
    return `/discussion/${id}`;
  }

  //       _ _                        _                                                        _
  //      | (_)                      (_)                                                      | |
  //    __| |_ ___  ___ _   _ ___ ___ _  ___  _ __     ___ ___  _ __ ___  _ __ ___   ___ _ __ | |_
  //   / _` | / __|/ __| | | / __/ __| |/ _ \| '_ \   / __/ _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __|
  //  | (_| | \__ \ (__| |_| \__ \__ \ | (_) | | | | | (_| (_) | | | | | | | | | | |  __/ | | | |_
  //   \__,_|_|___/\___|\__,_|___/___/_|\___/|_| |_|  \___\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__|

  getAllDiscussionComment(id: string) {
    return `/discussionComment/getAll/${id}`;
  }

  getOneDiscussionComment(id: string) {
    return `/discussionComment/${id}`;
  }

  createDiscussionComment() {
    return '/discussionComment/create';
  }

  deleteDiscussionComment(id: string) {
    return `/discussionComment/${id}`;
  }

  updateDiscussionComment(id: string) {
    return `/discussionComment/${id}`;
  }
}
