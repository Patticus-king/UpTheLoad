function Box({title,children}){
    return(
        <div className="box">
            <h3>{title}</h3>
            {children}
        </div>
    )
}
export default Box;