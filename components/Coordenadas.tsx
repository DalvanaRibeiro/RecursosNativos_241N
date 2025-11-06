import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native"
import * as Location from "expo-location" // Módulo Expo para acessar o GPS do dispositivo
export default function Coordenadas(){
    // Estados para armazenar latitude e longitude
    const [latitude, setLatitude] =useState< number | null>(null)
    const [longitude, setLongitude] =useState< number | null>(null)

    // Estado para mensagens de erro ou status
    const [mensagem, setMensagem] = useState("Aguardando permissão....")
    // Função que pede permissão e obtém coordenadas
    async function obterLocalizacao() {
        try {
            // Pede permissão 
            const {status} = await Location.requestForegroundPermissionsAsync()
            if( status !== "granted"){
                setMensagem("Permissão negada para acessar localização")
                return
            }
            // Obtém a posição atual do dispositivo
            const localizacao = await Location.getCurrentPositionAsync({})
            setLatitude(localizacao.coords.latitude)
            setLongitude(localizacao.coords.longitude)
            setMensagem("Coordenadas obtidas com sucesso!")
        } catch (error) {
            setMensagem("Erro ao obter localização.")
            console.log(error)
        }
        
    }
    // useEffect : executa automaticamente ao abrir o app
    useEffect(() => {
        obterLocalizacao()
    },[])
    // Interface do aplicativo
    return(
        <View style={styles.container}>
            <Text style={styles.titulo}> Localização Atual</Text>
            {/** Se tiver coordenadas, mostra os valores; senão, mostra a mensagem */}
            {latitude && longitude ? (
                <>
                <Text style={ styles.texto}> Latitude: {latitude}</Text>
                <Text style={ styles.texto}> Longitude: {longitude}</Text>
                </>
            ): (
                <Text style={styles.texto}> {mensagem}</Text>
            )}
            {/** Botão para atualizar as coordenadas manualmente */}
            <TouchableOpacity style={styles.botao} onPress={obterLocalizacao}>
                <Text style={styles.textoBotao}> Atualizar </Text>
            </TouchableOpacity>

        </View>
    )
}
const styles =StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#0B1220",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    titulo:{
        fontSize: 22,
        fontWeight: "bold",
        color: "#FFD93D",
        marginBottom: 20
    },
    texto:{
        color: "#fff",
        fontSize: 16,
        marginVertical: 5
    },
    botao:{
        backgroundColor: "#FFD93D",
        padding:12,
        borderRadius: 10,
        marginTop: 20
    },
    textoBotao: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 16
    }
})