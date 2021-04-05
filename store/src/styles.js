import styled from 'styled-components';

const Label = styled.label`
    font-size: 18px;
    margin: 15px 10px;
`
const Title = styled(Label)`
    font-size: 28px;
`
const Button = styled.button`
    font-size: 16px;
    color: blue;
    margin: 15px 10px;
`
const ComboBox = styled.select`
    font-size: 18px;
    color: blue;
    margin: 15px 10px;
    width: ${props => (props.width || 120)}px;
`
const TextBox = styled.input`
    font-size: 16px;
    margin: 15px 0;
`
const BaseDiv = styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
`
const BaseContainer = styled(BaseDiv)`
    width: 100%;
    background-color: #f2f2f2;
    font-size: 20px;
    color: blue;
    border: solid 2px blue;
    border-radius: 5px;
`
const Block = styled(BaseContainer)`
    width: 60%;
    height: auto;
    font-size: 18px;
    color: gray;
    margin: 35px;
    padding: 20px;
`
const Container = styled(BaseDiv)`
    background-color: #35486f;
    min-height: 100vh;
`
const Row = styled.div`
    display: flex;
    flex-direction: row;
`
export {Container, Label, Title, Button, TextBox, ComboBox, Block, Row}