import { initState } from "./state";
import * as Types from "@/shared/types";
import * as Services from "@/entities/services";
import * as StoreTemplates from "./template";
import * as Models from "@/entities/Models";
import { UnwrapRef } from "vue";
import * as DTOs from "@/entities/DTOs";

export const initActions = function (state: ReturnType<typeof initState>) {
    const setAiRequests = async function () {
        const service = new Services.AiRequest();

        const response = await service.getAll();

        if (response.result) {
            state.genericList.value = response.data.genericList;
            state.aiRequests.value = response.data.entities;
        } else {
            console.error(response.data);
        }
    };

    const addNewReponse = function (response: DTOs.AiRequestDTO.DTO) {
        const model = new Models.AiRequest(response);

        state.genericList.value.unshift(model.id);
        state.aiRequests.value[model.id] = model;
    };

    const setSelectRequest = function (v: number) {
        state.selectRequest.value = v;
    };

    const resetSelectRequest = function () {
        state.selectRequest.value = null;
    };

    const loadFilePDF = async function () {
        const service = new Services.ExportService();

        const response = await service.loadFile("pdf");

        if (response.result) {
            console.log(response);
        } else {
            console.error(response.data);
        }
    };

    const loadFileExcel = async function () {
        const service = new Services.ExportService();

        const response = await service.loadFile("excel");

        console.log(response);

        if (response.result) {
            console.log(response);
        } else {
            console.error(response.data);
        }
    };

    return {
        setSelectRequest,
        resetSelectRequest,
        setAiRequests,
        addNewReponse,
        loadFilePDF,
        loadFileExcel,
    };
};
