function Box({title,children}){
    return(
        <div className="box">
            <h3>{title}</h3>
            <hr />
            {children}
        </div>
    )
}
export default Box;