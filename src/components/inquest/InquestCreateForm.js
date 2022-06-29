/* eslint-disable react/prop-types */
/* eslint-disable radix */
/* eslint-disable no-unneeded-ternary */
import { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
// Material
import {
  Box,
  FormControl,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Slide,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Typography
} from '@mui/material';
// Components
import { useFormik } from 'formik';
import { CancelOutlined, AddOutlined, RemoveOutlined } from '@mui/icons-material';

InquestCreateForm.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  parentCallback: PropTypes.any
};

const steps = ['Da un nombre y descripcion a la encuesta', 'Agrega una serie de preguntas', 'Agrega los destinatarios'];
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const defaultQuestionState = {
  id: 0,
  question: '',
  questionType: '',
  answers: []
};
const defaultEmailState = {
  name: '',
  email: ''
};
const QUESTION_TYPE = [
  { value: '', label: 'SELECCIONE' },
  { value: '1', label: 'Opcion multiple' },
  { value: '2', label: 'Abierta' }
];

function QuestionRows({
  onChange,
  onRemove,
  onAddAnswer,
  onRemoveAnswer,
  question,
  answers,
  questionType,
  questionRows,
  index
}) {
  return (
    <div>
      <FormControl style={{ marginRight: '5px', marginTop: '10px', width: '5%' }}>
        <Button variant="contained" onClick={onRemove}>
          <CancelOutlined />
        </Button>
      </FormControl>
      <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '35%' }}>
        <TextField
          id="question"
          name="question"
          label="Pregunta"
          onChange={(e) => onChange(null, 'question', e.target.value)}
          value={question || ''}
          size="small"
        />
      </FormControl>
      <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '20%' }}>
        <TextField
          id="questionType"
          name="questionType"
          label="Tipo de pregunta"
          onChange={(e) => {
            onChange(null, 'questionType', e.target.value);
          }}
          value={questionType || ''}
          select
          size="small"
        >
          {QUESTION_TYPE.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
      <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '5%' }}>
        <Button
          disabled={questionType === '1' || questionType === '3' ? false : true}
          variant="contained"
          onClick={onAddAnswer}
        >
          <AddOutlined />
        </Button>
      </FormControl>
      {questionRows[index].answers.map((obj, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            marginLeft: '45%',
            marginTop: '8px',
            width: '20%'
          }}
        >
          <FormControl>
            <TextField
              id="answer"
              name="answer"
              label="Respuesta"
              onChange={(e) => onChange(index, 'answers', e.target.value)}
              value={answers[index]?.value || ''}
              size="small"
            />
          </FormControl>
          <FormControl style={{ marginLeft: '10px', marginTop: '2px', width: '5%' }}>
            <Button variant="contained" onClick={() => onRemoveAnswer(index)}>
              <RemoveOutlined />
            </Button>
          </FormControl>
        </div>
      ))}
    </div>
  );
}
// eslint-disable-next-line react/prop-types
function EmailRows({ onChange, onRemove, name, email }) {
  return (
    <div>
      <CancelOutlined style={{ marginLeft: '10px', marginTop: '15px' }} onClick={onRemove} />
      <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '30%' }}>
        <TextField
          id="name"
          name="name"
          label="Nombre"
          onChange={(e) => onChange('name', e.target.value)}
          value={name || ''}
          size="small"
        />
      </FormControl>
      <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '30%' }}>
        <TextField
          id="email"
          name="email"
          label="Email"
          onChange={(e) => onChange('email', e.target.value)}
          value={email || ''}
          size="small"
        />
      </FormControl>
    </div>
  );
}

export default function InquestCreateForm({ open, close, parentCallback }) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [questionRows, setQuestionRows] = useState([defaultQuestionState]);
  const [emailRows, setEmailRows] = useState([defaultEmailState]);
  const [countQuestions, setCountQuestions] = useState(1);
  const [countAnswers, setCountAnswers] = useState(0);
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      content: [],
      emails: []
    },
    onSubmit: (values, { resetForm }) => {
      parentCallback(values);
      resetForm(formik.initialValues);
      setActiveStep(0);
      setQuestionRows([defaultQuestionState]);
      setEmailRows([defaultEmailState]);
    }
  });

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleOnChangeQuestions = (index, indexA, name, value) => {
    const copyRows = [...questionRows];
    if (indexA !== null && name === 'answers') {
      const updateItem = [...questionRows[index]?.answers];
      updateItem[indexA].value = value;
      copyRows[index] = {
        ...copyRows[index],
        [name]: updateItem
      };
    } else {
      copyRows[index] = {
        ...copyRows[index],
        [name]: value
      };
    }
    setQuestionRows(copyRows);
    formik.setFieldValue('content', copyRows);
  };

  const handleOnAddQuestion = () => {
    const increment = 1;
    setCountQuestions(countQuestions + increment);
    const copyRows = [...questionRows];
    copyRows.push({ id: countQuestions, question: '', questionType: '', answers: [] });
    setQuestionRows(copyRows);
  };

  const handleOnAddAnswer = (indexQ) => {
    const increment = 1;
    setCountAnswers(countAnswers + increment);
    const updateItem = [...questionRows[indexQ]?.answers];
    updateItem.push({ value: '' });
    const newArray = [...questionRows];
    newArray[indexQ].answers = updateItem;
    setQuestionRows(newArray);
  };

  const handleOnRemoveAnswer = (indexQ, indexA) => {
    const updateItem = [...questionRows[indexQ]?.answers];
    updateItem.splice(indexA, 1);
    const newArray = [...questionRows];
    newArray[indexQ].answers = updateItem;
    setQuestionRows(newArray);
  };

  const handleOnRemoveQuestion = (index) => {
    const copyRows = [...questionRows];
    copyRows.splice(index, 1);
    setQuestionRows(copyRows);
  };

  const handleOnChangeEmails = (index, name, value) => {
    const copyRows = [...emailRows];
    copyRows[index] = {
      ...copyRows[index],
      [name]: value
    };
    setEmailRows(copyRows);
    formik.setFieldValue('emails', copyRows);
  };

  const handleOnAddEmails = () => {
    setEmailRows(emailRows.concat(defaultEmailState));
  };

  const handleOnRemoveEmails = (index) => {
    const copyRows = [...emailRows];
    copyRows.splice(index, 1);
    setEmailRows(copyRows);
  };

  const handleClose = () => {
    formik.setFieldValue('name', '');
    formik.setFieldValue('description', '');
    formik.setFieldValue('content', []);
    formik.setFieldValue('emails', []);
    setActiveStep(0);
    setQuestionRows([defaultQuestionState]);
    setEmailRows([defaultEmailState]);
    setCountQuestions(0);
    setCountAnswers(0);
    close();
  };

  // eslint-disable-next-line consistent-return
  const getInquestContent = (activeStep) => {
    switch (activeStep) {
      case 0:
        return (
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <FormControl style={{ marginLeft: '10px', marginTop: '25px', width: '40%' }}>
              <TextField
                id="name"
                name="name"
                label="Nombre"
                onChange={formik.handleChange}
                value={formik.values.name || ''}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
                size="small"
              />
            </FormControl>
            <FormControl style={{ marginLeft: '10px', marginTop: '25px', width: '40%' }}>
              <TextField
                id="description"
                name="description"
                label="Descripcion"
                onChange={formik.handleChange}
                value={formik.values.description || ''}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                fullWidth
                size="small"
              />
            </FormControl>
          </div>
        );
      case 1:
        return (
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            {questionRows.map((row, index) => (
              <div key={index}>
                <QuestionRows
                  {...row}
                  index={index}
                  questionRows={questionRows}
                  onChange={(indexAnswer, name, value) => handleOnChangeQuestions(index, indexAnswer, name, value)}
                  onAddAnswer={() => handleOnAddAnswer(index)}
                  onRemove={() => handleOnRemoveQuestion(index)}
                  onRemoveAnswer={(indexAnswer) => handleOnRemoveAnswer(index, indexAnswer)}
                />
              </div>
            ))}
            <Button onClick={handleOnAddQuestion}>Agregar pregunta</Button>
          </div>
        );
      case 2:
        return (
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            {emailRows.map((row, index) => (
              <EmailRows
                {...row}
                onChange={(name, value) => handleOnChangeEmails(index, name, value)}
                onRemove={() => handleOnRemoveEmails(index)}
                key={index}
              />
            ))}
            <Button onClick={handleOnAddEmails}>Agregar</Button>
          </div>
        );
      default:
        break;
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={close}
      aria-describedby="alert-dialog-slide-description"
      fullWidth
      maxWidth={'lg'}
    >
      <Box style={{ width: '100%' }}>
        <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
          <DialogTitle>{'Nueva encuesta'}</DialogTitle>
          <DialogContent>
            <Stack spacing={3}>
              <FormControl>
                <Stepper activeStep={activeStep}>
                  {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepSkipped(index)) {
                      stepProps.completed = false;
                    }
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                {activeStep === steps.length ? (
                  <>
                    <Typography style={{ textAlign: 'center' }} sx={{ mt: 5, mb: 1 }}>
                      Completaste todos los pasos, ya puedes guardar la informacion
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                      <Box sx={{ flex: '1 1 auto' }} />
                      <Button onClick={handleReset}>Reiniciar</Button>
                    </Box>
                  </>
                ) : (
                  <>
                    {getInquestContent(activeStep)}
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                      <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                        Regresar
                      </Button>
                      <Box sx={{ flex: '1 1 auto' }} />
                      <Button onClick={handleNext}>
                        {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                      </Button>
                    </Box>
                  </>
                )}
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button variant="contained" disabled={activeStep >= 3 ? false : true} color="primary" type="submit">
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Box>
    </Dialog>
  );
}
