export interface ILoggerBody {
  message: IMessageBody;
}

export interface IMessageBody {
  uuid: string;
  func_name: string;
  message: string;
  endpoint: string;
}
