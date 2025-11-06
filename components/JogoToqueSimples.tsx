import React, {useEffect, useState, useRef}from "react";
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, Vibration} from "react-native"
// Utilizando Dimensions para ler a altura e largura da janela do aparelho
const{width: largura, height: altura} = Dimensions.get("window")

export default function JogoToqueSimples(){
    // Guarda a posição (x,y) do quadro da tela
    const [posicao, setPosicao] = useState({x: 100, y: 200})
    // Guarda a pontuação atual do jogador
    const [pontos, setPontos] = useState(0)
    // Guarda o tempo restante
    const [tempo, setTempo] =useState(30)
    // Indica se o jogo está ativo ou terminou
    const [ativo, setAtivo] = useState(true)
    // Referência para o intervalo que move o quadrado periodicamente
    const intervaloPosicao = useRef<ReturnType<typeof setInterval> | null >(null)
    // Referência para o intervalo do cronômetro regressivo
    const intervaloTempo = useRef<ReturnType<typeof setInterval> | null>(null)
    // Efeito: inicia/para os intervalos quando o estado "ativo" muda
    useEffect(()=>{
        // Só  inicia intervalos se o jogo estiver ativo
        if(ativo){
            // A cada 2s, chama  a função que muda a posição do quadrado
            intervaloPosicao.current = setInterval(mudarPosicao, 2000)
            // A cada 1s, reduz o tempo em 1 segundo
            intervaloTempo.current=setInterval(() => {
                setTempo((t) => (t > 0 ? t - 1 : 0))
            }, 1000);
        }
        // Função de limpeza: ao pausar/encerrar 
        return () => {
            if (intervaloPosicao.current) clearInterval(intervaloPosicao.current)
                if(intervaloTempo.current) clearInterval(intervaloTempo.current)
        }

    },[ativo]) // Reexecuta quando "ativo" muda
    // Função que calcula nova posição aleatória para o quadrado
    const mudarPosicao = () => {
        const tamanho = 80 
        const margemTopo = 130
        const margemBaixo = 100
        const margemLateral = 20
        // Novo X aleatório respeitando bordas
        const novoX = Math.random() * (largura - tamanho - margemLateral * 2) +margemLateral
        // Novo Y 
        const novoY = Math.random() * (altura - margemTopo - margemBaixo - tamanho) + margemTopo
        // Atualiza o estado com a nova posição
        setPosicao({ x: novoX, y: novoY})
    }
    // quando toca no quadrado -> pontua, move e vibre 
    const tocar = () => {
        // Se o jogo não está ativo, ou o tempo acabou, não faz nada
        if(!ativo || tempo <= 0) return
        // Soma 1 ponto à pontuação atual
        setPontos((p) => p + 1)
        // Move o quadrado para uma nova posição
        mudarPosicao()
        // Vibração curta (feeedback tátil nativo)
        Vibration.vibrate(100)
    }
    // Efeito: quando o tempo chega a 0, encerra o jogo ( ativo = false)
    useEffect(() => {
        if (tempo === 0 ){
            setAtivo(false)
        }
    }, [tempo]) // Observa mudanças no tempo 

    // Reiniciar os estados para começar um novo jogo
    const reiniciar = () => {
        setPontos(0)
        setTempo(30)
        setAtivo(true)
        mudarPosicao()
    } 
    return(
    // Renderiza a interface do jogo
    <View style={styles.tela}>
        {/** Cabeçaçhp com tempo e pontos */}
        <View style={styles.topo} >
            {/** Mostra o tempo restante */}
            <Text style={styles.texto}> 🕔 Tempo: {tempo}</Text>
            {/** Mostra a Pontuação atual */}
            <Text style={styles.texto}> ✅ Pontos: {pontos}</Text>
        </View>
        {/** Se o jogo está ativo, mostra o quadrado clicável */}
        {ativo && (
            <TouchableOpacity
            // Ao tocar o quadrado, executa a lógica de pontuar + vibrar
            onPress={tocar}
            // Suaviza o feedback visual do toque
            activeOpacity={0.8}
            // Posiciona o quadrado conforme o estado "posicao"
            style={[styles.quadrado, {left: posicao.x, top: posicao.y}]}
            />
        )}
        {/** Se o jogo não está ativo (tempo acabou), mostra o botão de reiniciar */}
        {!ativo &&(
            <TouchableOpacity
            // Ao tocar, reinicia todos os estados do jgo
            style={styles.botao}
            onPress={reiniciar}
            >
                <Text style={styles.textoBotao}> Reiniciar</Text>
            </TouchableOpacity>
        )}

    </View>
    )
}

const styles = StyleSheet.create({
    tela: {
        flex: 1,
        backgroundColor: "#E0F7FA"
    },
    topo:{
        position: "absolute", // fixa no topo
        top: 40,
        alignSelf: "center", // centraliza horizontalmente
        alignItems: "center"
    },
    texto: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#004D40"
    },
    quadrado:{
        position: "absolute",
        width: 80,
        height: 80,
        backgroundColor: "#4CAF50",
        borderRadius: 12
    },
    botao: {
        position: "absolute",
        bottom: 80,
        alignSelf: "center",
        backgroundColor: "#00796B",
        paddingHorizontal: 30,
        paddingVertical: 14,
        borderRadius: 10
    },
    textoBotao: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold"
    }
})