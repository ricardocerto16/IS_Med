import React, { Component } from 'react';
import './App.css';
import AppList from './components/AppList'
import AppSidebar from './components/AppSidebar'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listAll: [],
      listOrc: []
    }
  }

  componentDidMount() {
    if (localStorage.getItem('listOrc')!==null && localStorage.getItem('listOrc')!==undefined){
      this.setState({ listOrc: JSON.parse(localStorage.getItem('listOrc')) });
    }
    localStorage.setItem("filter",'');
  }

  newOrcid(orcidValue) {
    const regex = new RegExp(/^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/);
    if (regex.test(orcidValue) === false) return;
    var orcList = [];
    var orcid = {
      value: orcidValue
    };
    if (localStorage.getItem('listOrc') !== null && localStorage.getItem('listOrc') !== undefined) {
      orcList = JSON.parse(localStorage.getItem('listOrc'))
    }
    var x;
    for (x in orcList) {
      if (orcList[x].value === orcidValue) return;
    }
    orcList = orcList.concat(orcid)
    localStorage.setItem('listOrc', JSON.stringify(orcList));
    this.setState({ listOrc: orcList });
  }
  remOrcid(orcidValue) {
    var orcList = JSON.parse(localStorage.getItem('listOrc')).filter(orc => orc.value !== orcidValue)
    localStorage.setItem('listOrc', JSON.stringify(orcList));
    this.setState({ listOrc: orcList });
  }

  filterToPresent() {
  }

  async background() {
    while (this.state.listOrc.length!==0) {
      var x;
      var orcList = this.state.listOrc;
      localStorage.setItem('provList',JSON.stringify([]));
      for (x in orcList) {
        var request = require('request-promise');
        await request({
          "method": "GET",
          "uri": "https://pub.orcid.org/v2.1/" + orcList[x].value + "/works",
          "json": true,
          "headers": {
            "content-type": "application/json",
            "Accept-Charset": "UTF-8"
          }
        }).then(reqJson => {
          var list = []

          var i;
          for (i in reqJson["group"]) {
            var art = reqJson["group"][i];
            var workFL = [];
            //Verifica se alguma das referencias de um artigo tem ligacao ao scopus se tiver adiciona a lista WorkFL
            var z;
            for (z in art["work-summary"]) {
              var work = art["work-summary"][z];
              var y;
              for (y in work["external-ids"]["external-id"]) {
                var eid = work["external-ids"]["external-id"][y];
                if (eid["external-id-type"] === "eid") {
                  workFL.push([work])
                }
              }
            }
            if (workFL.length === 0) {
              //Caso nenhuma das referencias esteja ligada ao scopus apenas guarda o titulo
              var artTitle = art["work-summary"][0]["title"]["title"]["value"]
              var pubData = art["work-summary"][0]["publication-date"]
              var year = (art["work-summary"][0]["publication-date"]!=null)?art["work-summary"][0]["publication-date"]["year"]["value"]:'';
              list.push(newArt(artTitle,year,art["last-modified-date"]["value"],''));
            }
            else {
              //Caso hajam varias referencias com ligacao ao scopus analisa a que tem display-index menor
              var workF = workFL[0]
              var k;
              for (k in workFL) {
                work = workFL[k];
                if (parseInt(work["display-index"], 10) < parseInt(workF["display-index"], 10)) {
                  workF = work
                }
              }
              var artTitle = workF[0]["title"]["title"]["value"]
              var year = workF[0]["publication-date"]["year"]["value"]
              var scopusID = ""
              var it;
              for (it in workF[0]["external-ids"]["external-id"]) {
                var eid = workF[0]["external-ids"]["external-id"][it];
                if (eid["external-id-type"] === "eid") {
                  scopusID = eid["external-id-value"]
                }
              }
              list.push(newArt(artTitle,year,art["last-modified-date"]["value"], scopusID));
            }
          }

          list = JSON.parse(localStorage.getItem('provList')).concat(list);
          localStorage.setItem('provList',JSON.stringify(list));


          function newArt(title,year,lastModDate, scopusA) {
            const item = {
              orcid: orcList[x],
              titulo: title,
              ano: year,
              dataModificacao: lastModDate,
              scopus: scopusA.substr(7)
            }
            return item;
          }
        });
      }
      const lista = JSON.parse(localStorage.getItem('provList'));
      localStorage.removeItem('provList');
      this.setState({
        listAll: lista
      });
      await new Promise(resolve => { setTimeout(() => { }, 100 * 1000); });
    }
  }

  render() {
    if (this.state.listOrc.length!==0){
      this.background();
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">IS - Sistema ORCID</h1>
        </header>
        <div>
          <div className="mySidebarScopus col-xs-3">
            <AppSidebar 
                  list={this.state.listOrc}
                  addOrcid={(orcid) => this.newOrcid(orcid)}
                  remOrcid={(orcid) => this.remOrcid(orcid)} />
          </div>
          <div className="listDiv col-xs-9 no-padding">
            <AppList 
                  list={this.state.listAll} 
                  orcs={this.state.listOrc}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;