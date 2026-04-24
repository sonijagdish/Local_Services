import { loadState, saveState } from "../../utils/localStorage";
import { v4 as uuidv4 } from "uuid";

const getServices = () => {
    return loadState("services") || [];
};

const addService = (serviceData) => {
    const services = loadState("services") || [];
    const newService = {
        id: uuidv4(),
        rating: 0,
        availability: true,
        createdAt: new Date().toISOString(),
        ...serviceData,
    };
    services.push(newService);
    saveState("services", services);
    return newService;
};

const updateService = (data) => {
    const services = loadState("services") || [];
    const updated = services.map((s) => s.id === data.id ? { ...s, ...data } : s);
    saveState("services", updated);
    return updated;
};

const toggleAvailability = (id) => {
    const services = loadState("services") || [];
    const updated = services.map((s) => 
        s.id === id ? { ...s, availability: !s.availability } : s
    );
    saveState("services", updated);
    return updated;
};

const deleteService = (id) => {
    const services = loadState("services") || [];
    const updated = services.filter((srv) => srv.id !== id);
    saveState("services", updated);
    return updated;
};

export default { getServices, addService, updateService, toggleAvailability, deleteService };
