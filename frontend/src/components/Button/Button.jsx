import "./Button.scss"

function Button({text}){
    return (
        <button className="custom-btn" type="submit">
            {text}
        </button>
    )
}

export default Button;