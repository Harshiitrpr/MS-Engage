return (
    <React.Fragment>        
        <AppBar className="footbar-wrapper" color="primary">
            <Toolbar className={`footbar-tool ${props.className}`}>
                {props.children}
            </Toolbar>
        </AppBar>
    </React.Fragment>
)