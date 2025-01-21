export default function ErrorMessage({errorType,type,errorMessages}) {
    if (errorType === "none") return null;
    return (
        <p className = {`error_label ${type ?? ''}`}>{errorMessages[errorType]}</p>
    );
}