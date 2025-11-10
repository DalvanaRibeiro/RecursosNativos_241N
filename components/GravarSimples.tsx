import React, {use, useRef, useState} from "react"
import {View, Text, TouchableOpacity, StyleSheet} from "react-native"

import {Audio} from "expo-av" // API de áudio do Expo (gravar/reproduzir)

export default function GravadorSimples(){

    const recRef = useRef<Audio.Recording | null>(null) // Referencia para o objeto de gravação (useRef não causa re-ender)
    const [gravando, setGravando] = useState(false) 
    const [uri, setUri] = useState<string | null>(null)  // guarda o caminho de arquivo de áudio gerado
    // Começa a gravação
    async function iniciar() {
        const p = await Audio.requestPermissionsAsync() // Pede a permissão do microfone
        if(p.status !== "granted") return alert("Permissão Negada!") //se negar, mostra o alerta e sai

        await Audio.setAudioModeAsync({ allowsRecordingIOS: true}) // iOS: habilita modo de gravação
        const rec = new Audio.Recording() // cria um novo gravador
        await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY) // Define alta qualidade
        await rec.startAsync() // inicia a captura de áudio
        recRef.current = rec  // guarda o objeto para parar depois
        setGravando(true) // atualiza o estado : está gravando
        setUri(null) // limpa a URI antiga         
    }
    // para e salva
    async function parar() {
        if(!recRef.current) return // se não há gravação ativa, não executa nada
        await recRef.current.stopAndUnloadAsync() // parar a gravação e descarrega o arquivo para armazenamento
        setUri(recRef.current.getURI()) // pega a uri do arquivo gerado e salva no estado
        recRef.current = null // limpa a referÊncia 
        setGravando(false)  // atualiza o estado: não está mais salvando
        
    }
    // toca o áudio
    async function ouvir() {
        if (!uri) return alert("Nada graavado!") // se não tem arquivo, avisa e sai
        const { sound } = await Audio.Sound.createAsync({uri}) // carrega o som a partir da uri gravada
        await sound.playAsync() // reproduz o áudio (o expo gerencia o descarte depois)
               
    }
    return(
        <View style={styles.container}>
            {/** botão que alterna entre iniciar/parar conforme o estado "gravando" */}
            <TouchableOpacity
            onPress={gravando ? parar : iniciar} // se está gravando -> para; se não -> inicia
            style={[
                styles.botao,
                {backgroundColor: gravando ? "#ef4444" :" #22c55e"}, // vermelho (parar) ou verde (gravar)
            ]}
            >
                <Text style={styles.texto}>
                    {gravando ? "Parar":"Gravar"} {/** Rótulo de botão muda com o estado */}
                </Text>
            </TouchableOpacity>
            {/** botão para ouvir a gravação (desativado enquanto não houver URI) */}
            <TouchableOpacity
            onPress={ouvir} // aciona a reprodução
            disabled={!uri} // sem arquivo desabilita
            style={[
                styles.botao,
                {backgroundColor: uri ? "#3b82f6" : "#9ca3af"}
            ]}
            >
                <Text style={styles.texto}> Ouvir</Text>
            </TouchableOpacity>
        </View>
    )
}
