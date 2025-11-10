


import React, { useRef, useState } from "react";              // importa React e os hooks useRef/useState
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"; // componentes visuais do RN
import { Audio } from "expo-av";                              // API de áudio do Expo (gravar/reproduzir)

export default function GravadorSimples() {                   // componente principal da tela

  const recRef = useRef<Audio.Recording | null>(null);        // referencia para o objeto de gravação (não causa re-render)
  const [gravando, setGravando] = useState(false);            // indica na UI se está gravando agora
  const [uri, setUri] = useState<string | null>(null);        // guarda o caminho do arquivo de áudio gerado

  // começa a gravação
  async function iniciar() {
    const p = await Audio.requestPermissionsAsync();          // pede permissão do microfone ao usuário
    if (p.status !== "granted") return alert("Permissão negada!"); // se negar, mostra alerta e sai

    await Audio.setAudioModeAsync({ allowsRecordingIOS: true });    // iOS: habilita modo de gravação (necessário no iOS)
    const rec = new Audio.Recording();                        // cria um novo gravador
    await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY); // define preset de alta qualidade (M4A/AAC)
    await rec.startAsync();                                   // inicia a captura de áudio
    recRef.current = rec;                                     // guarda o objeto para parar depois
    setGravando(true);                                        // atualiza estado: está gravando
    setUri(null);                                             // limpa URI antiga (se houver)
  }

  //  para e salva
  async function parar() {
    if (!recRef.current) return;                              // se não há gravação ativa, não faz nada
    await recRef.current.stopAndUnloadAsync();                // para a gravação e descarrega o arquivo para armazenamento
    setUri(recRef.current.getURI());                          // pega a URI do arquivo gerado e salva no estado
    recRef.current = null;                                    // limpa a referência (libera objeto)
    setGravando(false);                                       // atualiza estado: não está mais gravando
  }

  //  toca o áudio
  async function ouvir() {
    if (!uri) return alert("Nada gravado!");                  // se não tem arquivo, avisa e sai
    const { sound } = await Audio.Sound.createAsync({ uri }); // carrega o som a partir da URI gravada
    await sound.playAsync();                                  // reproduz o áudio (o Expo gerencia o descarte depois)
  }

  
  return (
    // contêiner centralizado com fundo suave
    <View style={estilos.container}>
      {/* título da tela */}
      <Text style={estilos.titulo}>🎤 Gravador Simples</Text>

      {/* botão que alterna entre iniciar/parar conforme o estado "gravando" */}
      <TouchableOpacity
        onPress={gravando ? parar : iniciar}                  // se está gravando → para; se não → inicia
        style={[
          estilos.botao,
          { backgroundColor: gravando ? "#ef4444" : "#22c55e" }, // vermelho (parar) ou verde (gravar)
        ]}
      >
        <Text style={estilos.texto}>
          {gravando ? "Parar" : "Gravar"}                     {/* rótulo do botão muda com o estado */}
        </Text>
      </TouchableOpacity>

      {/* botão para ouvir a gravação (desativado enquanto não houver URI) */}
      <TouchableOpacity
        onPress={ouvir}                                       // aciona a reprodução
        disabled={!uri}                                       // sem arquivo → desabilita
        style={[
          estilos.botao,
          { backgroundColor: uri ? "#3b82f6" : "#9ca3af" },   // azul ativo / cinza desabilitado
        ]}
      >
        <Text style={estilos.texto}>Ouvir</Text>              {/* rótulo fixo */}
      </TouchableOpacity>
    </View>
  );
}

// estilo simples e bonito (cores calmas, layout central)
const estilos = StyleSheet.create({
  container: {
    flex: 1,                         // ocupa a tela toda
    backgroundColor: "#ECFDF5",      // verde bem claro de fundo
    alignItems: "center",            // centraliza horizontal
    justifyContent: "center",        // centraliza vertical
  },
  titulo: {
    fontSize: 22,                    // tamanho de fonte do título
    fontWeight: "bold",              // negrito
    marginBottom: 25,                // espaço abaixo do título
    color: "#065F46",                // verde escuro (contraste)
  },
  botao: {
    padding: 14,                     // área clicável confortável
    borderRadius: 10,                // cantinhos arredondados
    width: 180,                      // largura fixa para padronizar
    alignItems: "center",            // centraliza o texto do botão
    marginVertical: 6,               // espaço entre botões
  },
  texto: {
    color: "white",                  // texto branco em botões coloridos
    fontSize: 18,                    // tamanho legível
    fontWeight: "600",               // semi-negrito
  },
});
