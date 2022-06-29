import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/es';
// @mui
import { Card, Typography, CardHeader, CardContent } from '@mui/material';
import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator, TimelineConnector } from '@mui/lab';
// utils
// _mock_
// ----------------------------------------------------------------------

AnalyticsOrderTimeline.propTypes = {
  events: PropTypes.array
};

export default function AnalyticsOrderTimeline({ events }) {
  return (
    <Card
      sx={{
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none'
        }
      }}
    >
      <CardHeader title="Eventos de la semana" />
      <CardContent>
        <Timeline>
          {events.map((item, index) => (
            <OrderItem key={item.id} item={item} isLast={index === events.length - 1} />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  isLast: PropTypes.bool,
  item: PropTypes.shape({
    start: PropTypes.string,
    title: PropTypes.string
  })
};

function OrderItem({ item, isLast }) {
  const { title, start } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot color="success" />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {moment(start).locale('es').format('dddd')}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
