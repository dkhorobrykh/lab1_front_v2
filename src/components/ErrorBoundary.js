import {Component} from "react";
import {Alert, Snackbar} from "@mui/material";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false, errorMessage: null}
    }

    static getDerivedStateFromError(error) {
        return {hasError: true, errorMessage: error.message};
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    handleClose = () => {
        this.setState({hasError: false, errorMessage: null})
    }

    render() {
        if (this.state.hasError) {
            return (
                <>
                    {this.props.children}
                    <Snackbar
                        open={Boolean(this.state.hasError)}
                        autoHideDuration={6000}
                        onClose={this.handleClose}
                        anchorOrigin={{vertical: "top", horizontal: "right"}}
                        >
                        <Alert onClose={this.handleClose} severity="error">
                            {this.state.errorMessage || "An unexpected error occurred"}
                        </Alert>
                    </Snackbar>
                </>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;