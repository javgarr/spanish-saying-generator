// Footer.js

import React, { useState, useEffect } from 'react';
import './Footer.css';
import translations from './translations.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faAndroid } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    const [activeModal, setActiveModal] = useState(null);
    const [locale, setLocale] = useState("en");
    const [strings, setStrings] = useState({});
  
    useEffect(() => {
      // Check if the browser's language starts with 'es' (for any Spanish variant)
      if (navigator.language.startsWith('es')) {
        setLocale('es');
        setStrings(translations.es);
      } else {
        setLocale('en');
        setStrings(translations.en);
      }
      console.log('Locale set to: ' + locale)
    }, []);
  
    return (
        <footer className="app-footer">
            <div class="bmc-container">
                <p> {strings.lovingit} </p>
                <a href="https://www.buymeacoffee.com/javigd"><img alt="Buy me a coffee!" src={`https://img.buymeacoffee.com/button-api/?text=${strings.buymecoffee}&emoji=☕&slug=javigd&button_colour=C60C30&font_colour=ffffff&font_family=Cookie&outline_colour=ffffff&coffee_colour=ffffff`} /></a>
            </div>
            <div style={{ paddingTop: 10, paddingBottom: 10 }}>
                <button onClick={() => setActiveModal('ios')}>
                    <FontAwesomeIcon icon={faApple} /> {strings.installios}
                </button>

                <button onClick={() => setActiveModal('android')}>
                    <FontAwesomeIcon icon={faAndroid} /> {strings.installandroid}
                </button>
                {activeModal === 'ios' && (
                    <div className="modal" onClick={() => setActiveModal(null)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h3>{strings.howtoinstall} iOS:</h3>
                            <pre style={{ textAlign: 'left' }}>{strings.instructions.ios}</pre>
                            <button style={{}} onClick={() => setActiveModal(null)}>Close</button>
                        </div>
                    </div>
                )}

                {activeModal === 'android' && (
                    <div className="modal" onClick={() => setActiveModal(null)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <h3>{strings.howtoinstall} Android:</h3>
                            <pre style={{ textAlign: 'left' }}>{strings.instructions.android}</pre>
                            <button style={{}} onClick={() => setActiveModal(null)}>Close</button>
                        </div>
                    </div>
                )}
                <p style={{fontSize:'10px'}}>© 2023 Spainify. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
