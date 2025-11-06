import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, Vibration} from "react-native"
import {Accelerometer} from "expo-sensors"

export default function SensorBolinha(){
    // Guarda as leituras do sensor (x, y)
    const [pos, setPos] = useState({x:0, y:0})
    // Guarda a Pontuação
    const [pontos, setPontos] = useState(0)
    useEffect(() => {
        // Atualiza o sensor 10x por segundo
        Accelerometer.setUpdateInterval(100)
        // Inicia o sensor
        const sub = Accelerometer.addListener((data) => {
            setPos({x: data.x, y:data.y})
        })
        // Remove o sensor quando o app fecha
        return () => sub && sub.remove()
    }, [])
    // Calcula se a bolinha está próxima do centro
    const centralizado = Math.abs(pos.x) < 0.1 && Math.abs(pos.y) <0.1
    
    // Soma os pontos qndo centraliza
    useEffect(() => {
        if(centralizado){
            setPontos((p) => p + 1)
            Vibration.vibrate(40)
        }
    }, [centralizado])

    return(
        <View style={styles.container}>
            <Text style={styles.titulo}> Equilibre a bolinha!</Text>
            {/** Área onde a bolinha se move  */}
            <View style={styles.area}>
                {/** Bolinha se move conforme o sensor  */}
                <View
                style={[
                    styles.bolinha,
                    {
                        transform: [
                            {translateX: pos.x * 100}, // multiplica para dar movimento
                            {translateY: pos.y * -100} // inverte Y
                        ],
                        backgroundColor: centralizado ? "#22c55e" : "#3b82f6"
                    }
                ]}
                />
            </View>
            {/** Mostra os pontos e valores  */}
            <Text style={styles.texto}>
                Pontos: {pontos} {centralizado ? "✅" : ""}
            </Text>
            <Text style={styles.coordenadas}>
                x: {pos.x.toFixed(2)} | y:{pos.y.toFixed(2)}
            </Text>
        </View>

    )


}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems:"center",
        justifyContent: "center",
        backgroundColor: "#f1f5f9",
        gap: 20
    },
    titulo:{
        fontSize: 22,
        fontWeight: "bold",
        color: "#1e3a8a"
    },
    area:{
        width: 200,
        height:200,
        backgroundColor: "#fff",
        borderRadius: 20,
        borderWidth:2,
        borderColor: "#94a3b8",
        alignItems:"center",
        justifyContent: "center"
    },
    bolinha:{
        width:40,
        height: 40,
        borderRadius:20
    },
    texto:{
        fontSize:18,
        color: "#1e3a8a"
    },
    coordenadas:{
        color: "#475569",
        fontFamily: "monospace"
    }
})