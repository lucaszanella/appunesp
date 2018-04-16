import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import randomColorPicker from './utils/randomColorPicker'
import parseDate from './utils/parseDate'
import initials from './utils/initials'


item = {
    subject: 'Mensagem aos alunos inscritos no ENADE 2017 - Concluintes ',
    sentBy: 'Geraldo Forti Pereira da Silva',
    message: `    De acordo com Edital INEP, os portões para adentrar no local da prova serão abertos às 12 horas e fechados às 13 horas.

    Lembramos que o estudante inscrito no ENADE 2017 deverá realizar o primeiro acesso em: http://enade.inep.gov.br/enade/#!/cadastrarEstudante
    
    Após o primeiro acesso, o estudante:
    - receberá senha provisória no e-mail informado durante o primeiro acesso ao sistema;
    - precisará gerar uma senha definitiva, alterando a provisória;
    - preencher o cadastro e
    - responder o questionário do estudante (obrigatório).
    
    Desde 13/11/2017 o INEP disponibilizou a informação quanto aos locais de prova (http://portal.inep.gov.br/artigo/-/asset_publisher/B4AQV9zFY7Bv/content/locais-de-prova-do-enade-2017-ja-estao-disponiveis-para-consulta/21206), sendo que somente terá acesso ao local de prova após ter sido preenchido o questionário do estudante.
    
    Assim, é IMPORTANTE que os estudantes inscritos realizem o preenchimento tanto do Cadastro quanto do Questionário.
    
    Os alunos que não realizarem esse procedimento estarão em situação irregular junto ao ENADE e não poderão colar grau, conforme determinado no Edital do ENADE 2017, item  16.3: "O Estudante concluinte que estiver em situação irregular perante o Exame não terá certificado de conclusão de curso ou diploma expedidos, tendo em vista que o Enade é um componente curricular obrigatório do curso, nos termos do § 5º do art. 5º da Lei nº 10.861 de 14 de abril de 2004".
    
    O acesso ao Sistema do ENADE é feito pelo link http://enade.inep.gov.br/enade/#!/index.
    
    Em caso de problema com o acesso, favor entrar em contato com o INEP:
    http://mec.cube.call.inf.br/auth-web/login?redirect_uri=http%3A%2F%2Ffale-conosco.mec.call.inf.br%2Fauth%2Fcallback&requested_uri=http%3A%2F%2Ffale-conosco.mec.call.inf.br%2Fsecoes%2F&token_aplicacao=e3lhqm5iVYbcOEfxMMvpBw#/0
    
    
    Eliana Corrêa Contiero
    Diretora Técnica Acadêmica-DTA
    Instituto de Geociências e Ciências Exatas
    UNESP-Câmpus de Rio Claro
    (19) 3526 9009 `,
}

export default class MessageViewer extends Component {
  render() {
    return (
      <View style={{flex:1}}>
        <Text style={styles.subject} numberOfLines={1}>{item.subject}</Text>
        <View style={styles.listItem}>
            <Avatar
                medium
                rounded
                title={initials(item.sentBy)}
                overlayContainerStyle={{backgroundColor: randomColorPicker(item.sentBy)}}
                onPress={() => console.log("Works!")}
                activeOpacity={0.7}
            />
            <View style={{flex: 9, flexDirection: 'column'}}>
                <Text style={styles.sentby}  numberOfLines={1}>{item.sentBy}</Text>
            </View>
            <View style={styles.time}>
                <Text style={styles.timeText}></Text>
            </View>
        </View>
        <View style={styles.messageContainer}>
            <Text style={styles.message}>{item.message}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
  },
  listItem: {
      flex:2,
      flexDirection: 'row',
      marginLeft:5,
      marginRight:5,
      marginBottom:7,
      marginTop: 3
  },
  welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
  },
  subject: {
      flex:1,
      fontSize: 12,
      textAlign: 'left',
      marginLeft: 10,
      marginRight: 10,
      fontWeight: '600'

  },
  sentby: {
      fontSize: 17,
      textAlign: 'left',
      marginLeft: 10,
      marginRight: 10,
      fontWeight: '600'

     // color: 'rgba(255, 255, 255, 0.7)'
  },
  message: {
      fontSize: 12,
      textAlign: 'left',
      marginLeft: 10,
      marginRight: 10,
      fontWeight: '400'

     // color: 'rgba(255, 255, 255, 0.7)'
  },
  messageContainer: {
    flex:20
   // color: 'rgba(255, 255, 255, 0.7)'
},
  time: {
      flexDirection: 'column',
      justifyContent: 'flex-start',  
      marginRight: 3,
      marginTop:3
  },
  timeText:{
      fontSize: 10,
  },
  instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
  },
});