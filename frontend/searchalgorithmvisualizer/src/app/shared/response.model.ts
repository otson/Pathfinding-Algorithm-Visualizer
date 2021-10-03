import {Cell} from "./cell.model";

export class Response {
  constructor(public traversal: Cell[] = [], public path: Cell[] = []) {
  }
}
