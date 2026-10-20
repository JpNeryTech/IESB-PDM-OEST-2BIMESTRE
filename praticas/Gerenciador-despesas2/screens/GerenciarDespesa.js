import { useLayoutEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useExpenses } from '../store/expenses-context';

const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Contas',
  'Outros',
];

function GerenciarDespesa({ route, navigation }) {
  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses();

  const expenseId = route.params?.expenseId;
  const isEditing = Boolean(expenseId);

  const despesaExistente = expenses.find(
    (expense) => expense.id === expenseId
  );

  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    data: new Date(),
    categoria: '',
  });

  const [errors, setErrors] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar despesa' : 'Nova despesa',
    });
  }, [navigation, isEditing]);

  useLayoutEffect(() => {
    if (isEditing && despesaExistente) {
      const data = new Date(despesaExistente.data);

      setForm({
        descricao: despesaExistente.descricao ?? '',
        valor: String(despesaExistente.valor ?? ''),
        data: Number.isNaN(data.getTime()) ? new Date() : data,
        categoria: despesaExistente.categoria ?? '',
      });
    }
  }, [isEditing, despesaExistente]);

  function handleChange(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  }

  function validateForm() {
    const newErrors = {};

    if (form.descricao.trim().length < 3) {
      newErrors.descricao =
        'A descrição deve ter pelo menos 3 caracteres.';
    }

    const valorNumerico = Number(form.valor);

    if (
      !form.valor.trim() ||
      !Number.isFinite(valorNumerico) ||
      valorNumerico <= 0
    ) {
      newErrors.valor = 'Informe um valor maior que zero.';
    }

    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);

    if (
      !(form.data instanceof Date) ||
      Number.isNaN(form.data.getTime())
    ) {
      newErrors.data = 'Informe uma data válida.';
    } else if (form.data > hoje) {
      newErrors.data = 'A data não pode ser futura.';
    }

    if (!form.categoria) {
      newErrors.categoria = 'Selecione uma categoria.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    const despesa = {
      descricao: form.descricao.trim(),
      valor: Number(form.valor),
      data: form.data.toISOString(),
      categoria: form.categoria,
    };

    if (isEditing) {
      updateExpense(expenseId, despesa);
    } else {
      addExpense({
        ...despesa,
        id: Date.now().toString(),
      });
    }

    navigation.goBack();
  }

  function confirmDelete() {
    if (!expenseId) {
      Alert.alert(
        'Erro',
        'Não foi possível identificar a despesa.'
      );
      return;
    }

    function excluir() {
      deleteExpense(expenseId);
      navigation.goBack();
    }

    if (Platform.OS === 'web') {
      const confirmado = window.confirm(
        'Tem certeza de que deseja excluir esta despesa?'
      );

      if (confirmado) {
        excluir();
      }

      return;
    }

    Alert.alert(
      'Excluir despesa',
      'Tem certeza de que deseja excluir esta despesa?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: excluir,
        },
      ]
    );
  }

  function handleAmountChange(value) {
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      handleChange('valor', value);
    }
  }

  function handleDateChange(event, selectedDate) {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      handleChange('data', selectedDate);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Descrição</Text>

        <TextInput
          style={[styles.input, errors.descricao && styles.inputError]}
          value={form.descricao}
          onChangeText={(value) =>
            handleChange('descricao', value)
          }
          placeholder="Ex.: Conta de luz"
          maxLength={100}
        />

        {errors.descricao && (
          <Text style={styles.errorText}>{errors.descricao}</Text>
        )}

        <Text style={styles.label}>Valor (R$)</Text>

        <TextInput
          style={[styles.input, errors.valor && styles.inputError]}
          value={form.valor}
          onChangeText={handleAmountChange}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />

        {errors.valor && (
          <Text style={styles.errorText}>{errors.valor}</Text>
        )}

        <Text style={styles.label}>Data</Text>

        <Pressable
          style={[styles.input, errors.data && styles.inputError]}
          onPress={() => setShowPicker(true)}
        >
          <Text>{form.data.toLocaleDateString('pt-BR')}</Text>
        </Pressable>

        {errors.data && (
          <Text style={styles.errorText}>{errors.data}</Text>
        )}

        {showPicker && (
          <DateTimePicker
            value={form.data}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        {Platform.OS === 'ios' && showPicker && (
          <Pressable
            style={styles.secondaryButton}
            onPress={() => setShowPicker(false)}
          >
            <Text style={styles.secondaryButtonText}>
              Confirmar data
            </Text>
          </Pressable>
        )}

        <Text style={styles.label}>Categoria</Text>

        <Pressable
          style={[
            styles.input,
            styles.categorySelector,
            errors.categoria && styles.inputError,
          ]}
          onPress={() => setShowCategories(true)}
        >
          <Text
            style={
              form.categoria
                ? styles.selectedText
                : styles.placeholder
            }
          >
            {form.categoria || 'Selecione uma categoria'}
          </Text>
        </Pressable>

        {errors.categoria && (
          <Text style={styles.errorText}>{errors.categoria}</Text>
        )}

        <Modal
          visible={showCategories}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCategories(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Selecione uma categoria
              </Text>

              {CATEGORIES.map((categoria) => (
                <Pressable
                  key={categoria}
                  style={styles.categoryOption}
                  onPress={() => {
                    handleChange('categoria', categoria);
                    setShowCategories(false);
                  }}
                >
                  <Text style={styles.categoryText}>
                    {categoria}
                  </Text>
                </Pressable>
              ))}

              <Pressable
                style={styles.secondaryButton}
                onPress={() => setShowCategories(false)}
              >
                <Text style={styles.secondaryButtonText}>
                  Cancelar
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Pressable
          style={styles.saveButton}
          onPress={handleSubmit}
        >
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Salvar alterações' : 'Cadastrar despesa'}
          </Text>
        </Pressable>

        {isEditing && (
          <Pressable
            style={styles.deleteButton}
            onPress={confirmDelete}
            accessibilityRole="button"
            accessibilityLabel="Excluir despesa"
          >
            <Text style={styles.deleteButtonText}>
              Excluir despesa
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default GerenciarDespesa;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
    color: '#222222',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
    justifyContent: 'center',
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    marginTop: 5,
  },
  categorySelector: {
    justifyContent: 'center',
  },
  placeholder: {
    color: '#888888',
  },
  selectedText: {
    color: '#222222',
  },
  saveButton: {
    backgroundColor: '#1565C0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 28,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D32F2F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#1565C0',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222222',
  },
  categoryOption: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DDDDDD',
  },
  categoryText: {
    fontSize: 16,
    color: '#222222',
  },
});