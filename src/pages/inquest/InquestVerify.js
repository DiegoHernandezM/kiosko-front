/* eslint-disable import/order */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-unneeded-ternary */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// material
import { Box, Button, Card, Container, Typography } from '@mui/material';

// redux
import { useDispatch } from '../../redux/store';
import { verifyInquest, createAnswers } from '../../redux/slices/inquest';
// components
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
import Image from '../../components/Image';

import AnserForm from '../../components/inquest/AnswerForm';

export default function InquestVerify() {
  const { themeStretch } = useSettings();
  const { uuid } = useParams();
  const dispatch = useDispatch();
  const [hideForm, setHideForm] = useState(false);
  const [hideMessage, setHideMessage] = useState(false);
  const [inquest, setInquest] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [recipient, setRecipient] = useState([]);
  const [answerStatus, setAnswerStatus] = useState(0);

  useEffect(() => {
    dispatch(getUuid(uuid));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  function getUuid(uuid) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(verifyInquest(uuid)));
      })
        .then((response) => {
          setInquest(response.data.inquest);
          setQuestions(response.data.inquest.content);
          setRecipient(response.data.recipient);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  const handleCallbackForm = (values) => {
    dispatch(sendAnswer(uuid, values.content, values.comments));
  };

  function sendAnswer(uuid, content, comments) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(createAnswers(uuid, content, comments)));
      })
        .then((response) => {
          if (response.status === 200) {
            setAnswerStatus(response.status);
            setHideForm(true);
            setHideMessage(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
  }
  return (
    <Page title="KIOSKO: Encuestas">
      {inquest.expired === 0 ? (
        <Container maxWidth={themeStretch ? false : 'lg'}>
          {recipient.status === 0 ? (
            <Container maxWidth={themeStretch ? false : 'lg'}>
              {answerStatus === 200 ? (
                <div hidden={!hideMessage}>
                  {' '}
                  <Card>
                    <Box
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'nowrap',
                        justifyContent: 'space-between',
                        textAlign: '-webkit-center'
                      }}
                    >
                      <Image style={{ width: '300px' }} alt="login" src="/logo/logo-ccp.png" />
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
                        Gracias por participar
                      </Typography>
                      <Button href="/">Inicio</Button>
                    </Box>
                  </Card>
                </div>
              ) : (
                <div hidden={hideForm}>
                  <AnserForm questions={questions} recipient={recipient} parentCallback={handleCallbackForm} />
                </div>
              )}
            </Container>
          ) : (
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
                  <Image style={{ width: '300px' }} alt="login" src="/logo/logo-ccp.png" />
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
                    Esta encuesta ya fue contestada
                  </Typography>
                  <Button href="/">Inicio</Button>
                </Box>
              </Card>
            </Container>
          )}
        </Container>
      ) : (
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
              <Image style={{ width: '300px' }} alt="login" src="/logo/logo-ccp.png" />
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
                Esta encuesta ya expiro
              </Typography>
              <Button href="/">Inicio</Button>
            </Box>
          </Card>
        </Container>
      )}
    </Page>
  );
}
