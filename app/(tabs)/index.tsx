
import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import JogoToqueSimples from "@/components/JogoToqueSimples";
// 👆 ajuste o caminho se o arquivo estiver em outra pasta

export default function App() {
  return (
    <View style={estilos.tela}>
      <StatusBar hidden /> 
      {/* Oculta a barra de status para tela cheia */}
      <JogoToqueSimples />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#E0F7FA", // mesmo fundo do jogo
  },
});
