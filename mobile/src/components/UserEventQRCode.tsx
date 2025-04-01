import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCodeSVG from 'react-native-qrcode-svg';
import DateHelper from '@/helpers/DateHelper';
import GlobalTheme from '@/styles/Global';
import { Ticket } from 'types/Ticket';

interface UserEventQRCodeProps {
  tickets: Ticket[];
}

const UserEventQRCode: React.FC<UserEventQRCodeProps> = ({ tickets }) => {
  return (
    <View style={styles.container}>
      {tickets.map((ticket, index) => (
        <View key={ticket.id} style={styles.ticketCard}>
          {ticket.sessionDetail ? (
            <>

              {/* Ticket & Ticket Status */}
              <View style={styles.ticketHeaderRow}>
                <Text style={styles.ticketTitle}>Ticket {index + 1}</Text>
                <Text
                  style={[
                    styles.statusText,
                    ticket.status === 'NotUsed' ? styles.statusGreen : styles.statusRed,
                  ]}
                >
                  ({ticket.status})
                </Text>
              </View>

              {/* Type & Price */}
              <Text style={styles.ticketTitle}>
                {ticket.sessionDetail.type} Ticket (${ticket.sessionDetail.price})
              </Text>

              {/* Date */}
              <Text style={styles.ticketInfo}>
                {DateHelper.formatDate(ticket.sessionDetail.startDate, true)} ~ {DateHelper.formatDate(ticket.sessionDetail.endDate ? ticket.sessionDetail.endDate : "", true)}
              </Text>

            </>
          ) : (
            <Text style={styles.ticketTitle}>Ticket {index + 1}</Text>
          )}

          {/* QRCode */}
          <QRCodeSVG value={ticket.QRCode} size={300} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  ticketHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketCard: {
    marginBottom: 80,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GlobalTheme.gray1,
    backgroundColor: GlobalTheme.white,
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 50,
  },
  ticketInfo: {
    fontSize: 14,
    color: GlobalTheme.gray3,
    marginBottom: 20,
  },
  statusGreen: {
    color: GlobalTheme.green,
  },
  statusRed: {
    color: GlobalTheme.danger,
  },
});

export default UserEventQRCode;
