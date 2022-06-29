/* eslint-disable consistent-return */
/* eslint-disable react/jsx-key */
/* eslint-disable array-callback-return */
/* eslint-disable no-unneeded-ternary */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// Material
import {
  Box,
  Card,
  Container,
  Button,
  FormControlLabel,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Typography,
  FormControl
} from '@mui/material';
import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
// Components
import { useFormik } from 'formik';
import useSettings from '../../hooks/useSettings';
import Image from '../Image';
import SnackAlert from '../general/SnackAlert';

AnswerForm.propTypes = {
  parentCallback: PropTypes.any,
  questions: PropTypes.array,
  recipient: PropTypes.any
};

const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(({ theme, checked }) => ({
  '.MuiFormControlLabel-label': checked && {
    color: theme.palette.primary.main
  }
}));

function MyFormControlLabel(props) {
  const radioGroup = useRadioGroup();

  let checked = false;

  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }

  return <StyledFormControlLabel checked={checked} {...props} />;
}

MyFormControlLabel.propTypes = {
  value: PropTypes.any
};

export default function AnswerForm({ questions, recipient, parentCallback }) {
  const { themeStretch } = useSettings();
  const [arrayAnswers, setArrayAnswers] = useState([]);
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState('success');
  const [message, setMessage] = useState('');
  const formik = useFormik({
    initialValues: {
      comments: '',
      content: []
    },
    onSubmit: (values) => {
      const answers = [];
      values.content.forEach((element) => {
        answers.push(element.answers.length);
      });
      const validateArray = (currentValue) => currentValue === 1;
      if (values.content.length === questions.length && answers.every(validateArray) === true) {
        parentCallback(values);
      } else {
        setMessage('¡Contesta todas las preguntas!');
        setTypeMessage('error');
        setOpenMessage(true);
      }
    }
  });

  useEffect(() => {
    setArrayAnswers(questions);
  }, [questions]);
  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const handleChange = (e, key, question, questionType) => {
    const copyRows = [...arrayAnswers];
    if (questionType === '2') {
      copyRows.splice(key, 1, {
        id: key,
        question,
        questionType,
        answers: e.target.value === '' ? [] : [e.target.value]
      });
    } else if (questionType === '1' || questionType === '3') {
      if (e.target.checked === true) {
        if (copyRows.length > 0) {
          if (copyRows.findIndex((x) => x.id === key) !== -1) {
            copyRows.splice(
              copyRows.findIndex((x) => x.id === key),
              1,
              { id: key, question, answers: [e.target.value] }
            );
          }
        }
      }
    }
    setArrayAnswers(copyRows);
    formik.setFieldValue('content', copyRows);
  };

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <Card>
        <Box
          style={{
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            textAlign: '-webkit-center'
          }}
        >
          <Image style={{ width: '200px' }} alt="login" src="/logo/logo-ccp.png" />
        </Box>
        <Box
          style={{
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '30px' }}>
            Encuesta de satisfaccion
          </Typography>
        </Box>
        <Box
          style={{
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            textAlign: 'center'
          }}
        >
          <Typography style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '30px' }}>
            Responde esta breve encuesta para ayudar al sistema Kiosko a mejorar. Tus comentarios son importantes
          </Typography>
        </Box>
      </Card>
      <Card>
        <Box style={{ width: '100%' }}>
          <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
            <div style={{ textAlign: 'center' }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Encuesta para: {recipient.name} </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {questions.map((row, index) => {
                      switch (row.questionType) {
                        case '1':
                          return (
                            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell component="th" scope="row">
                                <Typography variant="h6">{row.question}</Typography>
                                <RadioGroup id="radioGroup" name="radioGroup" row>
                                  {row.answers.map((answers) => (
                                    <MyFormControlLabel
                                      key={answers.id}
                                      id="radioGroup-items"
                                      value={answers.value}
                                      label={answers.value}
                                      control={
                                        <Radio
                                          onChange={(e) => handleChange(e, row.id, row.question, row.questionType)}
                                        />
                                      }
                                    />
                                  ))}
                                </RadioGroup>
                              </TableCell>
                            </TableRow>
                          );
                        case '2':
                          return (
                            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell component="th" scope="row">
                                <Typography variant="h6">{row.question}</Typography>
                                <TextField
                                  id="openQuestion"
                                  name="openQuestion"
                                  label="respuesta"
                                  onChange={(e) => handleChange(e, row.id, row.question, row.questionType)}
                                  value={arrayAnswers[index]?.answers || ''}
                                  error={null}
                                  fullWidth
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          );
                        case '3':
                          return (
                            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell component="th" scope="row">
                                <Typography variant="h6">{row.question}</Typography>
                                <RadioGroup id="radioGroup" name="radioGroup" row>
                                  {row.answers.map((answers) => (
                                    <MyFormControlLabel
                                      key={answers.id}
                                      id="radioGroup-items"
                                      value={answers.value}
                                      label={answers.value}
                                      control={
                                        <Radio
                                          onChange={(e) => handleChange(e, row.id, row.question, row.questionType)}
                                        />
                                      }
                                    />
                                  ))}
                                </RadioGroup>
                              </TableCell>
                            </TableRow>
                          );
                        default:
                          break;
                      }
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
              <TextField
                id="comments"
                name="comments"
                label="Comentarios"
                onChange={formik.handleChange}
                value={formik.values.comments || ''}
                error={formik.touched.comments && Boolean(formik.errors.comments)}
                helperText={formik.touched.comments && formik.errors.comments}
                fullWidth
                size="small"
                multiline
                rows={8}
                variant="outlined"
              />
            </FormControl>
            <SnackAlert message={message} type={typeMessage} open={openMessage} close={handleCloseMessage} />
            <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}>
              <Button variant="contained" color="primary" type="submit">
                Enviar
              </Button>
            </div>
          </form>
        </Box>
      </Card>
    </Container>
  );
}
