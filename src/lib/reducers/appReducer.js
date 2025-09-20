
export const appReducer = (state, action) => {
  // The SET_STATE action is special: it replaces the entire state.
  // It should be handled first and should not be blocked by the null state guard.
  if (action.type === 'SET_STATE') {
      return action.payload;
  }

  // If state is null (e.g., logged out) and the action is not to set the state,
  // then we shouldn't proceed. This prevents errors on other actions.
  if (!state) return null;
    
  const { activePropertyId } = state;

  const updateProperty = (propertyId, updateFn) => {
    if (!propertyId) return state.properties;
    return state.properties.map(p => 
      p.id === propertyId ? updateFn(p) : p
    );
  };

  switch (action.type) {
    case 'SET_ACTIVE_PROPERTY':
      return { ...state, activePropertyId: action.payload };

    case 'ADD_ROOM':
        return {
            ...state,
            properties: updateProperty(activePropertyId, p => ({ ...p, rooms: [...(p.rooms || []), action.payload] }))
        };

    case 'UPDATE_ROOM':
        return {
            ...state,
            properties: updateProperty(activePropertyId, p => ({ ...p, rooms: (p.rooms || []).map(r => r.id === action.payload.id ? action.payload : r) }))
        };

    case 'DELETE_ROOM':
        return {
            ...state,
            properties: updateProperty(activePropertyId, p => ({ ...p, rooms: (p.rooms || []).filter(r => r.id !== action.payload.id) }))
        };

    case 'ADD_TENANT_AND_ADJUST_RENT': {
      const { newTenant: tenantData } = action.payload;
      
      const newTenant = {
          ...tenantData,
          payments: [],
          otherCharges: [],
      };

      const properties = updateProperty(activePropertyId, property => {
        const updatedTenants = [...(property.tenants || []), newTenant];
        const room = (property.rooms || []).find(r => r.id === newTenant.roomId);

        if (room && room.rentSharing) {
            const tenantsInSameRoom = updatedTenants.filter(t => t.roomId === newTenant.roomId);
            if (tenantsInSameRoom.length > 0) {
                 const rentPerTenant = room.rent / tenantsInSameRoom.length;
                 const finalTenants = updatedTenants.map(t => {
                    if (t.roomId === newTenant.roomId) {
                        return { ...t, rent: rentPerTenant };
                    }
                    return t;
                });
                return { ...property, tenants: finalTenants };
            }
        }
        return { ...property, tenants: updatedTenants };
      });
      return { ...state, properties };
    }

    case 'APPLY_ELECTRICITY_BILL': {
      const { reading } = action.payload;
      const properties = updateProperty(activePropertyId, property => {
        const tenantsInRoom = (property.tenants || []).filter(t => t.roomId === reading.roomId);
        if (tenantsInRoom.length === 0) return property;
        
        const amountPerTenant = parseFloat(reading.totalAmount) / tenantsInRoom.length;

        const updatedTenants = property.tenants.map(t => {
          if (tenantsInRoom.some(tr => tr.id === t.id)) {
            const otherCharges = (t.otherCharges || []).filter(oc => oc.id !== `elec-${reading.id}`);
            otherCharges.push({
              id: `elec-${reading.id}`,
              amount: amountPerTenant,
              description: `Electricity Bill for ${new Date(reading.date).toLocaleString('default', { month: 'long' })}`,
              date: reading.date,
            });
            return { ...t, otherCharges };
          }
          return t;
        });

        const updatedElectricity = (property.electricity || []).map(r => r.id === reading.id ? { ...r, applied: true } : r);
        return { ...property, tenants: updatedTenants, electricity: updatedElectricity };
      });
      return { ...state, properties };
    }
    
    case 'UPDATE_PROPERTY_DATA': {
       const { key, data } = action.payload;
       return {
           ...state,
           properties: updateProperty(activePropertyId, p => ({ ...p, [key]: data }))
       };
    }
    
    case 'UPDATE_OWNER_DEFAULTS': {
        return {
            ...state,
            defaults: { ...(state.defaults || {}), ...action.payload }
        };
    }

    default:
      return state;
  }
};