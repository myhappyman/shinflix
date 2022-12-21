interface IModalItem {
  datas: string | number;
}

function ModalInfoItem({ datas }: IModalItem) {
  return <>{datas ? <li>{datas}</li> : null}</>;
}

export default ModalInfoItem;
