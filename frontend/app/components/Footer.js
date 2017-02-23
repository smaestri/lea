import React from 'react'

class Footer extends React.Component {

    render() {
        return (
        <footer id="colophon">
            <div className="footer-upper container">

                <div className="one-third column">
                    <h3>a&middot;gil&middot;i&middot;ty</h3>
                    <ol>
                        <li>the power of moving quickly and easily; nimbleness.</li>
                        <li>the ability to think and draw conclusions quickly; intellectual acuity.</li>
                    </ol>
                </div>

                <div className="one-third column">
                    <h3>Get in touch</h3>
                    <div className="three columns alpha">
                        <strong>Agility, Inc</strong>
                        <p>Madrid &amp; Berlin<br/>
                            +99 111.999.7621<br/>
                            <a className="button" href="contact.php" >Contact</a>
                        </p>

                    </div>


                </div>

            </div>

            <div id="footer-base">
                <div className="container">
                    <div className="eight columns">
                        &copy; Livres entre amis, 2017
                    </div>
                    <div className="eight columns far-edge">
                        Proudly powered by an army of gerbils.
                    </div>
                </div>
            </div>
        </footer>
        )
    }
}

export default Footer
