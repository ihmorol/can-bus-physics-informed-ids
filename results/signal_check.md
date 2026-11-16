# Signal behaviour checks (step 3)

Rows with mean wheel speed above 5.0 km/h only. Correlation = Pearson r.

## dump1  (243038 moving rows of 286290)
- wheel FL vs FR vs RL vs RR: max spread 0.375 km/h (median of per-row max-min)
- R1 wheel vs CF_Clu_Vanz r=0.9995, vs VS r=0.9999, vs VS_TCU r=0.9999
- R2 d(wheel speed)/dt vs LONG_ACCEL r=0.8986
- R3 YAW_RATE vs (RR-RL) r=0.8825
- R4 LAT_ACCEL vs speed*YAW_RATE r=0.8585
- YAW_RATE vs SAS_Angle r=0.8956
- R5 N/speed by gear (median, IQR): g1: 136.3 (134.4-159.4, n=6328), g2: 80.5 (79.7-101.4, n=32773), g3: 51.1 (50.9-51.2, n=26483), g4: 36.3 (36.2-36.6, n=10009), g5: 27.6 (27.5-27.7, n=22288), g6: 21.9 (21.8-22.1, n=92064), g7: 17.8 (17.7-17.9, n=53093)

## dump2  (314375 moving rows of 378894)
- wheel FL vs FR vs RL vs RR: max spread 0.281 km/h (median of per-row max-min)
- R1 wheel vs CF_Clu_Vanz r=0.9991, vs VS r=0.9999, vs VS_TCU r=0.9999
- R2 d(wheel speed)/dt vs LONG_ACCEL r=0.9246
- R3 YAW_RATE vs (RR-RL) r=0.886
- R4 LAT_ACCEL vs speed*YAW_RATE r=0.7692
- YAW_RATE vs SAS_Angle r=0.9223
- R5 N/speed by gear (median, IQR): g1: 136.1 (134.6-164.7, n=6836), g2: 80.1 (65.5-82.3, n=48551), g3: 51.1 (51.0-51.4, n=69800), g4: 36.4 (36.2-36.6, n=42678), g5: 27.6 (27.5-27.8, n=42551), g6: 21.9 (21.8-22.1, n=83921), g7: 17.8 (17.7-17.9, n=20038)

## dump3  (254263 moving rows of 296330)
- wheel FL vs FR vs RL vs RR: max spread 0.375 km/h (median of per-row max-min)
- R1 wheel vs CF_Clu_Vanz r=0.9995, vs VS r=0.9999, vs VS_TCU r=0.9999
- R2 d(wheel speed)/dt vs LONG_ACCEL r=0.9048
- R3 YAW_RATE vs (RR-RL) r=0.8848
- R4 LAT_ACCEL vs speed*YAW_RATE r=0.8654
- YAW_RATE vs SAS_Angle r=0.8892
- R5 N/speed by gear (median, IQR): g1: 151.5 (136.2-183.1, n=3860), g2: 80.7 (79.5-101.9, n=35925), g3: 51.1 (50.9-51.3, n=25282), g4: 36.3 (36.2-36.6, n=13124), g5: 27.6 (27.5-27.7, n=35903), g6: 21.9 (21.8-22.0, n=86753), g7: 17.9 (17.8-17.9, n=53416)

## dump4  (346713 moving rows of 436402)
- wheel FL vs FR vs RL vs RR: max spread 0.344 km/h (median of per-row max-min)
- R1 wheel vs CF_Clu_Vanz r=0.9992, vs VS r=0.9999, vs VS_TCU r=0.9999
- R2 d(wheel speed)/dt vs LONG_ACCEL r=0.9183
- R3 YAW_RATE vs (RR-RL) r=0.9068
- R4 LAT_ACCEL vs speed*YAW_RATE r=0.7934
- YAW_RATE vs SAS_Angle r=0.916
- R5 N/speed by gear (median, IQR): g1: 142.5 (134.7-169.7, n=7741), g2: 80.9 (79.6-105.1, n=72555), g3: 51.2 (50.9-51.5, n=44274), g4: 36.3 (36.2-36.5, n=47125), g5: 27.6 (27.5-27.8, n=69330), g6: 21.9 (21.8-22.0, n=76253), g7: 17.9 (17.7-17.9, n=29435)

## dump5  (243744 moving rows of 267235)
- wheel FL vs FR vs RL vs RR: max spread 0.375 km/h (median of per-row max-min)
- R1 wheel vs CF_Clu_Vanz r=0.9995, vs VS r=0.9999, vs VS_TCU r=0.9999
- R2 d(wheel speed)/dt vs LONG_ACCEL r=0.9143
- R3 YAW_RATE vs (RR-RL) r=0.8887
- R4 LAT_ACCEL vs speed*YAW_RATE r=0.8417
- YAW_RATE vs SAS_Angle r=0.8993
- R5 N/speed by gear (median, IQR): g1: 148.8 (138.0-167.1, n=4797), g2: 80.5 (76.7-90.6, n=32590), g3: 51.1 (50.9-51.5, n=17041), g4: 36.3 (36.2-36.6, n=17604), g5: 27.7 (27.5-27.8, n=12789), g6: 21.9 (21.8-22.0, n=120799), g7: 17.8 (17.7-17.9, n=38124)

## dump6  (297026 moving rows of 392385)
- wheel FL vs FR vs RL vs RR: max spread 0.281 km/h (median of per-row max-min)
- R1 wheel vs CF_Clu_Vanz r=0.9994, vs VS r=0.9999, vs VS_TCU r=0.9999
- R2 d(wheel speed)/dt vs LONG_ACCEL r=0.9241
- R3 YAW_RATE vs (RR-RL) r=0.7487
- R4 LAT_ACCEL vs speed*YAW_RATE r=0.7737
- YAW_RATE vs SAS_Angle r=0.8538
- R5 N/speed by gear (median, IQR): g1: 134.9 (134.2-158.8, n=13349), g2: 81.1 (79.1-115.3, n=64733), g3: 51.2 (51.0-51.5, n=36381), g4: 36.4 (36.2-36.6, n=41696), g5: 27.7 (27.5-27.8, n=29093), g6: 21.9 (21.8-22.0, n=55283), g7: 17.8 (17.7-17.9, n=56491)

## dump7  (0 moving rows of 442611)
Too little moving data; probably the idling recording.
