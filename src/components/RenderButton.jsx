import { Button } from "react-bootstrap";

const RenderButton = ({ formSteps, setFormSteps, formState }) => {
  const { isValid } = formState;

  const nextStep = () => {
    if (isValid) {
      setFormSteps((prev) => prev + 1);
    }
  };

  if (formSteps === 1) {
    return (
      <div className="mt-4">
        <Button variant="dark" type="submit">
          Continue
        </Button>
      </div>
    );
  } else {
    return (
      <div className="mt-4">
        <button
          disabled={!isValid}
          onClick={nextStep}
          className="btn btn-dark"
          type="button"
        >
          Continue
        </button>
      </div>
    );
  }
};

export default RenderButton;
