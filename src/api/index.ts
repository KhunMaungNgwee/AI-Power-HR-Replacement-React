import * as auth from "./auth";
import * as candidate from "./candidate";
import * as idCard from "./id-card";
import * as interview from "./interview";
import * as position from "./position";
import * as uploadInto from "./upload-into";
import * as onBoard from "./on-board";
import * as jrPosition from "./jr";
import * as f2fSlot from "./line2";

class API {
  auth: typeof auth;
  candidate: typeof candidate;
  interview: typeof interview;
  position: typeof position;
  idCard: typeof idCard;
  uploadInto: typeof uploadInto;
  onBoard: typeof onBoard;
  jrPosition: typeof jrPosition;
  f2fSlot: typeof f2fSlot;

  constructor() {
    this.auth = auth;
    this.candidate = candidate;
    this.interview = interview;
    this.position = position;
    this.idCard = idCard;
    this.uploadInto = uploadInto;
    this.onBoard = onBoard;
    this.jrPosition = jrPosition;
    this.f2fSlot = f2fSlot;
  }
}

const api = new API();

export default api;
