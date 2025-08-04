import { useMemo } from 'react';
import { Page, View, Text, Font, Document, StyleSheet } from '@react-pdf/renderer';

// Simple formatting functions
const fDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const fCurrency = (amount) => {
  const formatted = new Intl.NumberFormat('fr-TN', {
    style: 'decimal',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  }).format(amount);
  return `${formatted} TND`;
};

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(() =>
    StyleSheet.create({
      page: {
        fontSize: 8,
        fontFamily: 'Roboto',
        backgroundColor: '#FFFFFF',
        padding: 20,
      },
      // Main title
      mainTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
        borderWidth: 2,
        borderColor: '#000',
        padding: 8,
        backgroundColor: '#f5f5f5',
      },
      // Subtitle with date
      subtitle: {
        fontSize: 9,
        textAlign: 'right',
        marginBottom: 15,
      },
      // Employee info section
      infoSection: {
        marginBottom: 10,
      },
      infoGrid: {
        flexDirection: 'row',
        marginBottom: 8,
      },
      infoBox: {
        border: '1px solid #000',
        padding: 4,
        marginRight: 5,
        minHeight: 25,
      },
      infoLabel: {
        fontSize: 7,
        fontWeight: 'bold',
        marginBottom: 2,
      },
      infoValue: {
        fontSize: 8,
      },
      // Table styles
      tableContainer: {
        marginTop: 10,
        marginBottom: 10,
      },
      tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
        borderWidth: 1,
        borderColor: '#000',
        padding: 3,
      },
      tableRow: {
        flexDirection: 'row',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000',
        padding: 2,
        minHeight: 15,
      },
      // Column widths matching the image
      colCode: { 
        width: '8%', 
        textAlign: 'center',
        fontSize: 7,
        fontWeight: 'bold',
      },
      colLibelle: { 
        width: '35%', 
        paddingLeft: 3,
        fontSize: 7,
      },
      colNombre: { 
        width: '10%', 
        textAlign: 'center',
        fontSize: 7,
      },
      colCategorie: { 
        width: '12%', 
        textAlign: 'center',
        fontSize: 7,
      },
      colEchelle: { 
        width: '8%', 
        textAlign: 'center',
        fontSize: 7,
      },
      colEchelon: { 
        width: '8%', 
        textAlign: 'center',
        fontSize: 7,
      },
      colGains: { 
        width: '10%', 
        textAlign: 'right',
        paddingRight: 3,
        fontSize: 7,
      },
      colRetenues: { 
        width: '9%', 
        textAlign: 'right',
        paddingRight: 3,
        fontSize: 7,
      },
      // Net to pay section
      netSection: {
        marginTop: 10,
        marginBottom: 15,
      },
      netRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#000',
        padding: 5,
        backgroundColor: '#f0f0f0',
      },
      netLabel: {
        fontSize: 9,
        fontWeight: 'bold',
      },
      netValue: {
        fontSize: 9,
        fontWeight: 'bold',
      },
      // Footer sections
      footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
      },
      footerBlock: {
        width: '45%',
        border: '1px solid #000',
        padding: 8,
        minHeight: 80,
      },
      footerTitle: {
        fontSize: 8,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
      },
      footerLabel: {
        fontSize: 7,
      },
      footerValue: {
        fontSize: 7,
      },
    }), []);

export function PayslipPDF({ payslip }) {
  const styles = useStyles();

  const {
    employee,
    editionDate,
    month,
    year,
    baseSalary,
    rows,
    netToPay,
    paymentMode,
    leaves,
  } = payslip;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Main Title */}
        <Text style={styles.mainTitle}>BULLETIN DE PAIE</Text>
        
        {/* Edition Date */}
        <Text style={styles.subtitle}>Édité le {fDate(editionDate)}</Text>

        {/* Employee Information Grid */}
        <View style={styles.infoSection}>
          {/* First Row */}
          <View style={styles.infoGrid}>
            <View style={[styles.infoBox, { width: '15%' }]}>
              <Text style={styles.infoLabel}>Matricule Employeur</Text>
            </View>
            <View style={[styles.infoBox, { width: '15%' }]}>
              <Text style={styles.infoLabel}>Statut</Text>
              <Text style={styles.infoValue}>Personnel Mensuel</Text>
            </View>
            <View style={[styles.infoBox, { width: '25%' }]}>
              <Text style={styles.infoLabel}>Année</Text>
              <Text style={styles.infoValue}>{year}</Text>
            </View>
            <View style={[styles.infoBox, { width: '15%' }]}>
              <Text style={styles.infoLabel}>Mois</Text>
              <Text style={styles.infoValue}>{month}</Text>
            </View>
            <View style={[styles.infoBox, { width: '25%' }]}>
              <Text style={styles.infoLabel}>Nature Paie</Text>
              <Text style={styles.infoValue}>Salaire Mensuel</Text>
            </View>
          </View>

          {/* Second Row */}
          <View style={styles.infoGrid}>
            <View style={[styles.infoBox, { width: '15%' }]}>
              <Text style={styles.infoLabel}>Matricule</Text>
              <Text style={styles.infoValue}>{employee.id}</Text>
            </View>
            <View style={[styles.infoBox, { width: '15%' }]}>
              <Text style={styles.infoLabel}>Nom</Text>
              <Text style={styles.infoValue}>{employee.lastName}</Text>
            </View>
            <View style={[styles.infoBox, { width: '15%' }]}>
              <Text style={styles.infoLabel}>Prénom</Text>
              <Text style={styles.infoValue}>{employee.firstName}</Text>
            </View>
            <View style={[styles.infoBox, { width: '15%' }]}>
              <Text style={styles.infoLabel}>État Civil</Text>
              <Text style={styles.infoValue}>-</Text>
            </View>
            <View style={[styles.infoBox, { width: '10%' }]}>
              <Text style={styles.infoLabel}>Nbre Enfants</Text>
              <Text style={styles.infoValue}>{employee.children || 0}</Text>
            </View>
            <View style={[styles.infoBox, { width: '25%' }]}>
              <Text style={styles.infoLabel}>Matricule Organisme</Text>
              <Text style={styles.infoValue}>123456</Text>
            </View>
          </View>

          {/* Third Row */}
          <View style={styles.infoGrid}>
            <View style={[styles.infoBox, { width: '30%' }]}>
              <Text style={styles.infoLabel}>Affectation</Text>
              <Text style={styles.infoValue}>{employee.department || 'Direction Financière'}</Text>
            </View>
            <View style={[styles.infoBox, { width: '15%' }]}>
              <Text style={styles.infoLabel}>Emploi</Text>
            </View>
            <View style={[styles.infoBox, { width: '10%' }]}>
              <Text style={styles.infoLabel}>Nombre</Text>
              <Text style={styles.infoValue}>26,00</Text>
            </View>
            <View style={[styles.infoBox, { width: '15%' }]}>
              <Text style={styles.infoLabel}>Catégorie</Text>
            </View>
            <View style={[styles.infoBox, { width: '10%' }]}>
              <Text style={styles.infoLabel}>Échelle</Text>
            </View>
            <View style={[styles.infoBox, { width: '10%' }]}>
              <Text style={styles.infoLabel}>Échelon</Text>
            </View>
            <View style={[styles.infoBox, { width: '15%' }]}>
              <Text style={styles.infoLabel}>Salaire de base</Text>
              <Text style={styles.infoValue}>{fCurrency(baseSalary)}</Text>
            </View>
          </View>
        </View>

        {/* Salary Table */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.colCode}>Code</Text>
            <Text style={styles.colLibelle}>Libellé</Text>
            <Text style={styles.colNombre}>Nombre</Text>
            <Text style={styles.colCategorie}>Catégorie</Text>
            <Text style={styles.colEchelle}>Échelle</Text>
            <Text style={styles.colEchelon}>Échelon</Text>
            <Text style={styles.colGains}>Gains</Text>
            <Text style={styles.colRetenues}>Retenues</Text>
          </View>

          {/* Table Rows */}
          {rows.map((row) => (
            <View key={row.code} style={styles.tableRow}>
              <Text style={styles.colCode}>{row.code}</Text>
              <Text style={styles.colLibelle}>{row.label}</Text>
              <Text style={styles.colNombre}>{row.number}</Text>
              <Text style={styles.colCategorie}>-</Text>
              <Text style={styles.colEchelle}>-</Text>
              <Text style={styles.colEchelon}>-</Text>
              <Text style={styles.colGains}>{row.gain > 0 ? fCurrency(row.gain) : ''}</Text>
              <Text style={styles.colRetenues}>{row.retenue > 0 ? fCurrency(row.retenue) : ''}</Text>
            </View>
          ))}
        </View>

        {/* Net to Pay Section */}
        <View style={styles.netSection}>
          <View style={styles.netRow}>
            <Text style={styles.netLabel}>Net à Payer</Text>
            <Text style={styles.netValue}>{fCurrency(netToPay)}</Text>
          </View>
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          {/* Leave Information */}
          <View style={styles.footerBlock}>
            <Text style={styles.footerTitle}>Congés en jours depuis le début de l'année</Text>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Droit</Text>
              <Text style={styles.footerValue}>{leaves.droit}</Text>
            </View>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Pris</Text>
              <Text style={styles.footerValue}>{leaves.pris}</Text>
            </View>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Solde</Text>
              <Text style={styles.footerValue}>{leaves.solde}</Text>
            </View>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Solde RC</Text>
              <Text style={styles.footerValue}>0.00</Text>
            </View>
            <Text style={[styles.footerLabel, { marginTop: 5 }]}>Emargement</Text>
          </View>

          {/* Payment Information */}
          <View style={styles.footerBlock}>
            <Text style={styles.footerTitle}>Mode de paiement</Text>
            <Text style={styles.footerValue}>{paymentMode}</Text>
            <Text style={[styles.footerLabel, { marginTop: 10 }]}>Banque</Text>
            <Text style={[styles.footerLabel, { marginTop: 5 }]}>Agence</Text>
            <Text style={[styles.footerLabel, { marginTop: 5 }]}>Compte</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
