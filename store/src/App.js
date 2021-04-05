import {useState, useEffect} from 'react';
import { getOrder, updateOrder, getRates } from './api';
import { Container, Label, Title, Button, TextBox, Block, ComboBox, Row }  from './styles';

const RateType = {
  CAD: 'CAD',
  GBP: 'GBP',
  EUR: 'EUR',
  USD: 'USD',
};

const CardType = {
  Paper: 'paper',
  Plastic: 'plastic',
};

const FinishType = {
  Matt: 'matt',
  Glossy: 'glossy'
};

const Colors = {
  Black:'black',
  White:'white',
  Green:'green',
  Red:'red',
  Pink: 'pink',
  Yellow:'yellow'};

const PaperColors = [Colors.Black,Colors.White,Colors.Green,Colors.Red];
const PlasticColors = [Colors.Black,Colors.White,Colors.Pink,Colors.Yellow];

const priceMap = {
  [CardType.Paper]:{
    [Colors.Black]: 16.95,
    [Colors.White]: 16.95,
    [Colors.Green]: 18.95,
    [Colors.Red]: 18.95,
  },
  [CardType.Plastic]:{
    [Colors.Black]: 28.95,
    [Colors.White]: 28.95,
    [Colors.Pink]: 32.95,
    [Colors.Yellow]: 32.95,
  },

}

function App() {
  const [initialized, setInitialized] = useState(false);
  const [orderText, setOrderText] = useState('');
  const [imgFile, setImgFile] = useState(null);
  const [orderColor, setOrderColor] = useState('');
  const [orderPrice, setOrderPrice] = useState(0);
  const [cardType, setCardType] = useState(CardType.Paper);
  const [finishType, setFinishType] = useState(FinishType.Matt);
  const [colorList, setColorList] = useState([]);
  const [rate,setRate] = useState(1);
  const [rateTypes,setRateTypes] = useState([]);
  const [rateType,setRateType] = useState(null);
  const [rates,setRates] = useState({});
  
  useEffect(()=>{
    if(!initialized){
      init();
    }
  },[initialized]);

  useEffect(()=>{
    setColorList(cardType === CardType.Paper ? PaperColors : PlasticColors);
  },[cardType]);

  useEffect(()=>{
    if(initialized){
      setOrderPrice(calcPrice());
    }
  },[cardType, finishType, orderColor, orderText, imgFile, rate]);

  const submit = () => {
    updateOrder({
      text: orderText,
      cardType: cardType, 
      material: finishType,
      color: orderColor, 
      price: orderPrice, 
      image: imgFile && imgFile.file ? imgFile.file : ''
    });
    init();
  }

  const init = () => {
    getOrder().then(order => {
      if(order) {
        const { text, cardType, material, color, price, image } = order;
        setOrderText(text);
        setImgFile(image);
        setOrderColor(color); 
        setOrderPrice(price); 
        setCardType(cardType);
        setFinishType(material);
      }
      setInitialized(true);
    });

    initRates();    
  };

  const initRates = () => {
    getRates().then(res => {
      const rates = {};
      if(!res || !res.rates){
        return;
      }
      
      Object.keys(RateType).forEach(k => {
        rates[k] = res.rates[k];
      });
      
      setRates(rates);
    });
  }

  const onSelectImage = (e) => {
    e.preventDefault();

    const reader = new FileReader();
    const file = e.target.files[0];
    console.log('onSelectImage',{file});
    reader.onloadend = () => {
      setImgFile({
        file: file,
        url: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  const calcPrice = () =>{
    let price = 0;
    if(!cardType){
      return price;
    }
    
    price = priceMap[cardType][orderColor];
    if(cardType === CardType.Paper && finishType === FinishType.Glossy){
        price += 3; 
    }
    if(orderText && orderText.length > 8){
      price += 5;
    }
    if(imgFile){
      price += 10;
    }
    
    const res = parseFloat((price * rate).toFixed(2));
    return res;
  };
  
  const renderRow1 = (title, child) => {
    if(!child){
      return null;
    }

    return (
      <div>
        <Label>{title}</Label>
        {Array.isArray(child) ? child.forEach(ch => {return <div>{ch}</div>;}) : child}
      </div>);
  };

  const renderRow = (title, children) => {
    if(!children){
      return null;
    }

    return (
      <Row>
        <Label>{title}</Label>
        {Array.isArray(children) ? 
        children.map((child, index) => (<div style={{paddingTop:1}} key={index}>{child}</div>)):
        children}
      </Row>);
  };

  const renderCardType = () => {
    return renderRow('Select Card type', 
      <ComboBox width={100} value={cardType} onChange={(e)=>setCardType(e.target.value)}>
        {Object.values(CardType).map(c => {return (<option value={c}>{c}</option>)})}
      </ComboBox>
    );
  }
  
  const renderFinishType = () => {
    if(cardType === CardType.Plastic){
      return null;
    }
    return renderRow('Select Finish type', 
      <ComboBox width={90} value={finishType} onChange={(e)=>setFinishType(e.target.value)}>
        {Object.values(FinishType).map(f => {return (<option value={f}>{f}</option>)})}
      </ComboBox>
    );
  }

  const renderColors = () => {
    return renderRow('Select Background', 
      <ComboBox width={80} value={orderColor} onChange={(e)=>setOrderColor(e.target.value)}>
        {colorList.map(c => {return (<option value={c}>{c}</option>)})}
      </ComboBox>
    );
  }

  const onRateChange = (rateId) => {
    const newRate = rates[rateId] || 1;
    setRate(newRate);
  }

  const renderPrice = () => {
    return renderRow("Order Price is ",
      [<div style={{paddingTop: 15}}><Label>{`$${orderPrice || 0}`}</Label></div>,      
      <ComboBox width={60} value={rateType} onChange={(e)=>onRateChange(e.target.value)}>
        {Object.values(RateType).map(r => {return (<option value={r}>{r}</option>)})}
      </ComboBox>]
    );
  }

  return (
    <Container>
        <Title>Create your Business Card</Title>
        <Block>
          {renderRow('Your text', 
            <TextBox type='input'
              maxLength={16} 
              value={orderText} 
              onChange={(e) => setOrderText(e.target.value)}/>)}
          {renderCardType()}
          {renderFinishType()}
          {renderColors()}
          {renderPrice()}
          <Button onClick={submit}>Submit Order</Button>
        </Block>
        <Block>
          <Label>Add image</Label>
          {imgFile && imgFile.url &&
          <img style={{width: 200, height: 150}} src={imgFile.url} alt="" />}
          <input type='file' text="select file" onChange={onSelectImage} />
        </Block>
    </Container>
  );
}

export default App;
