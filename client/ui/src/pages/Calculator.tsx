import { useState } from 'react'
import '../styles/Calculator.css' 

const Calculator = () => {
    const [mathString, setCalculatorString] = useState('') 
    
    return (
        <div className='calculatorContainer'>
            <input type='text' readOnly={true} value={mathString} />

            <div className='codeNumbers'>
                <div onClick={() => setCalculatorString(mathString + '1')} ><span>1</span></div>
                <div onClick={() => setCalculatorString(mathString + '2')} ><span>2</span></div>
                <div onClick={() => setCalculatorString(mathString + '3')} ><span>3</span></div>
                <div onClick={() => setCalculatorString(mathString + '4')} ><span>4</span></div>
                <div onClick={() => setCalculatorString(mathString + '5')} ><span>5</span></div>
                <div onClick={() => setCalculatorString(mathString + '6')} ><span>6</span></div>
                <div onClick={() => setCalculatorString(mathString + '7')} ><span>7</span></div>
                <div onClick={() => setCalculatorString(mathString + '8')} ><span>8</span></div>
                <div onClick={() => setCalculatorString(mathString + '9')} ><span>9</span></div>
                <div onClick={() => setCalculatorString(mathString + '+')} ><span>+</span></div>
                <div onClick={() => setCalculatorString(mathString + '0')} ><span>0</span></div>
                <div onClick={() => setCalculatorString(mathString + '-')} ><span>-</span></div>
                <div onClick={() => setCalculatorString(mathString + '/')} ><span>/</span></div>
                <div onClick={() => setCalculatorString('')}><span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M93.13 257.7C71.25 275.1 53 313.5 38.63 355.1L99 333.1c5.75-2.125 10.62 4.749 6.625 9.499L11 454.7C3.75 486.1 0 510.2 0 510.2s206.6 13.62 266.6-34.12c60-47.87 76.63-150.1 76.63-150.1L256.5 216.7C256.5 216.7 153.1 209.1 93.13 257.7zM633.2 12.34c-10.84-13.91-30.91-16.45-44.91-5.624l-225.7 175.6l-34.99-44.06C322.5 131.9 312.5 133.1 309 140.5L283.8 194.1l86.75 109.2l58.75-12.5c8-1.625 11.38-11.12 6.375-17.5l-33.19-41.79l225.2-175.2C641.6 46.38 644.1 26.27 633.2 12.34z"/></svg></span></div>
                <div onClick={() => setCalculatorString(mathString + '*')} ><span>*</span></div>
                <div onClick={() => setCalculatorString(eval(mathString))} ><span>=</span></div>
            </div>
        </div>
    )
}

export default Calculator 