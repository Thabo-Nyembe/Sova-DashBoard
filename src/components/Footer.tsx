import React from 'react';
import { View, Text, StyleSheet } from 'react-native-web';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <View style={styles.container}>
        <View style={styles.footerContent}>
          <View style={styles.footerLogo}>
            <Text style={styles.logoText}>SOVA</Text>
            <Text style={styles.tagline}>Intelligent Hospitality, Seamlessly Delivered</Text>
          </View>
          
          <View style={styles.footerLinks}>
            <View style={styles.linkColumn}>
              <Text style={styles.columnTitle}>Product</Text>
              <Link to="/#features" style={styles.footerLink}>Features</Link>
              <Link to="/#solutions" style={styles.footerLink}>Solutions</Link>
              <Link to="/#pricing" style={styles.footerLink}>Pricing</Link>
              <Link to="/app" style={styles.footerLink}>Demo</Link>
            </View>
            
            <View style={styles.linkColumn}>
              <Text style={styles.columnTitle}>Company</Text>
              <Link to="/about" style={styles.footerLink}>About Us</Link>
              <Link to="/careers" style={styles.footerLink}>Careers</Link>
              <Link to="/blog" style={styles.footerLink}>Blog</Link>
              <Link to="/contact" style={styles.footerLink}>Contact</Link>
            </View>
            
            <View style={styles.linkColumn}>
              <Text style={styles.columnTitle}>Resources</Text>
              <Link to="/support" style={styles.footerLink}>Support</Link>
              <Link to="/documentation" style={styles.footerLink}>Documentation</Link>
              <Link to="/privacy" style={styles.footerLink}>Privacy Policy</Link>
              <Link to="/terms" style={styles.footerLink}>Terms of Service</Link>
            </View>
          </View>
          
          <View style={styles.footerSocial}>
            <Text style={styles.columnTitle}>Connect With Us</Text>
            <View style={styles.socialIcons}>
              <Link to="#" style={styles.socialIcon}>
                <Text>LI</Text>
              </Link>
              <Link to="#" style={styles.socialIcon}>
                <Text>TW</Text>
              </Link>
              <Link to="#" style={styles.socialIcon}>
                <Text>IG</Text>
              </Link>
              <Link to="#" style={styles.socialIcon}>
                <Text>FB</Text>
              </Link>
            </View>
          </View>
        </View>
        
        <View style={styles.footerBottom}>
          <Text style={styles.copyright}>&copy; 2025 SOVA Hospitality Technology. All rights reserved.</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#1A2A3A',
    paddingTop: 60,
    paddingBottom: 30,
  },
  container: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    width: '100%',
  },
  footerContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  footerLogo: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 30,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 600,
    marginBottom: 30,
  },
  linkColumn: {
    width: '30%',
    minWidth: 150,
    marginBottom: 20,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  footerLink: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 10,
    textDecoration: 'none',
  },
  footerSocial: {
    width: '100%',
    maxWidth: 200,
    marginBottom: 30,
  },
  socialIcons: {
    flexDirection: 'row',
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textDecoration: 'none',
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 20,
    alignItems: 'center',
  },
  copyright: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  '@media (max-width: 768px)': {
    footerContent: {
      flexDirection: 'column',
    },
    footerLogo: {
      marginBottom: 40,
    },
    footerLinks: {
      flexDirection: 'column',
    },
    linkColumn: {
      width: '100%',
      marginBottom: 30,
    },
  },
});

export default Footer;
