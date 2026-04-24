import Text from "./components/text";
import Icon from "./components/icon";
import Badge from "./components/badge";
import Button from "./components/button";
import ButtonIcon from "./components/buttonicon";

import TrashIcon from "./assets/icons/Trash-Regular.svg?react";
import CheckIcon from "./assets/icons/Check-Regular.svg?react";
import PencilIcon from "./assets/icons/PencilSimple-Regular.svg?react";
import PlusIcon from "./assets/icons/Plus-Regular.svg?react";
import SpinnerIcon from "./assets/icons/spinner.svg?react";
import XIcon from "./assets/icons/X-Regular.svg?react";

function App() {
  

  return (
    <div className="grid gap-3">
    <div className="flex flex-col gap-2">
    <Text variant="body-sm-bold" className="text-pink-base">
      Olá mundo!
    </Text>
    <Text variant="body-md" className="text-pink-base">
      Olá mundo!
    </Text>
    <Text variant="body-md-bold">
      Olá mundo!
    </Text>
    </div>
    <div className="flex gap-1">
        <Icon svg={TrashIcon} className="fill-green-base "/>
        <Icon svg={CheckIcon} />
        <Icon svg={PencilIcon} />
        <Icon svg={PlusIcon} />
        <Icon svg={SpinnerIcon} animate />
        <Icon svg={XIcon} />
    </div>
    <div>
      <Badge variant="primary">5</Badge>
      <Badge variant="secondary">2 de 5</Badge>
    </div>
    <div>
      <Button icon={PlusIcon} variant="primary">Nova Tarefa</Button>
    </div>
    <div>
      <ButtonIcon icon={TrashIcon} variant="primary" />
      <ButtonIcon icon={TrashIcon} variant="secondary" />
      <ButtonIcon icon={TrashIcon} variant="terciary" />
    </div>
    </div>
  )
}

export default App;
