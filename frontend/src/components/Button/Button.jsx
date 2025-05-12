import "./Button.scss"

function Button({text ,onClick }){
    return (
        <button className="custom-btn" type="submit"  onClick={onClick}>
            {text}
        </button>
    )
}

export default Button;